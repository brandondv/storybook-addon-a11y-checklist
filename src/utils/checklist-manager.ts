import { promises as fs } from "fs";
import { createHash } from "crypto";
import { resolve, join } from "path";
import { z } from "zod";
import type {
  ChecklistFile,
  ChecklistItem,
  ComponentHashResponse,
  WCAGLevel,
  ChecklistStatus,
} from "../types";
import { DEFAULT_CONFIG } from "../constants";

// Validation schema for checklist files
const ChecklistItemSchema = z
  .object({
    guidelineId: z.string(),
    level: z.enum(["A", "AA", "AAA"] as const),
    status: z.enum(["pass", "fail", "not_applicable", "unknown"] as const),
    reason: z.string().optional(),
  })
  .refine(
    (data: { status: ChecklistStatus; reason?: string }) => {
      // If status is 'fail', reason is required
      if (data.status === "fail" && !data.reason?.trim()) {
        return false;
      }
      return true;
    },
    {
      message: "Reason is required when status is 'fail'",
      path: ["reason"],
    },
  );

const ChecklistFileSchema = z.object({
  version: z.string(),
  storyId: z.string(),
  componentName: z.string().optional(),
  componentPath: z.string(),
  componentHash: z.string(),
  lastUpdated: z.string(),
  updatedBy: z.string().optional(),
  results: z.array(ChecklistItemSchema),
  meta: z
    .object({
      notes: z.string().optional(),
      generatedBy: z.string().optional(),
    })
    .optional(),
});

export class ChecklistManager {
  private checklistDir: string;
  private projectRoot: string;

  constructor(
    projectRoot: string,
    checklistDir: string = DEFAULT_CONFIG.checklistDir,
  ) {
    this.projectRoot = projectRoot;
    this.checklistDir = resolve(projectRoot, checklistDir);
  }

  /**
   * Ensure the checklist directory exists
   */
  private async ensureDirectoryExists(): Promise<void> {
    try {
      await fs.access(this.checklistDir);
    } catch {
      await fs.mkdir(this.checklistDir, { recursive: true });
    }
  }

  /**
   * Get the file path for a story's checklist
   */
  private getChecklistFilePath(storyId: string): string {
    return join(this.checklistDir, `${storyId}.a11y.json`);
  }

  /**
   * Compute SHA-256 hash of a file's contents
   */
  async computeComponentHash(
    componentPath: string,
  ): Promise<ComponentHashResponse> {
    try {
      const absolutePath = resolve(this.projectRoot, componentPath);
      const content = await fs.readFile(absolutePath, "utf-8");
      const hash = createHash("sha256").update(content, "utf-8").digest("hex");
      return { hash: `sha256:${hash}`, exists: true };
    } catch (error) {
      console.warn(`Failed to compute hash for ${componentPath}:`, error);
      return { hash: "", exists: false };
    }
  }

  /**
   * Load a checklist file for a story
   */
  async loadChecklist(storyId: string): Promise<ChecklistFile | null> {
    try {
      const filePath = this.getChecklistFilePath(storyId);
      const content = await fs.readFile(filePath, "utf-8");
      const data = JSON.parse(content);

      // Validate the data structure
      const validated = ChecklistFileSchema.parse(data);
      return validated;
    } catch (error) {
      if ((error as any).code === "ENOENT") {
        return null; // File doesn't exist
      }
      console.error(`Error loading checklist for ${storyId}:`, error);
      throw error;
    }
  }

  /**
   * Save a checklist file
   */
  async saveChecklist(checklist: ChecklistFile): Promise<void> {
    try {
      // Validate the checklist data
      ChecklistFileSchema.parse(checklist);

      await this.ensureDirectoryExists();

      // Update metadata
      const updatedChecklist: ChecklistFile = {
        ...checklist,
        lastUpdated: new Date().toISOString(),
        meta: {
          ...checklist.meta,
          generatedBy: `storybook-addon-a11y-checklist@1.0.0`,
        },
      };

      const filePath = this.getChecklistFilePath(checklist.storyId);
      const content = JSON.stringify(updatedChecklist, null, 2);
      await fs.writeFile(filePath, content, "utf-8");
    } catch (error) {
      console.error(`Error saving checklist for ${checklist.storyId}:`, error);
      throw error;
    }
  }

  /**
   * Create a default checklist template for a story
   */
  async createDefaultChecklist(
    storyId: string,
    componentPath: string,
    componentName?: string,
    wcagVersion: string = DEFAULT_CONFIG.wcagVersion,
  ): Promise<ChecklistFile> {
    // Import the guidelines dynamically to avoid circular dependency issues
    const { getGuidelinesByVersion } = await import("../data/wcag-guidelines");
    const guidelines = getGuidelinesByVersion(wcagVersion);

    const results: ChecklistItem[] = guidelines.map((guideline: any) => ({
      guidelineId: guideline.id,
      level: guideline.level,
      status: "unknown" as ChecklistStatus,
      reason: undefined,
    }));

    return {
      version: wcagVersion,
      storyId,
      componentName,
      componentPath,
      componentHash: "", // Will be computed when saved
      lastUpdated: new Date().toISOString(),
      results,
      meta: {
        notes: "",
        generatedBy: `storybook-addon-a11y-checklist@1.0.0`,
      },
    };
  }

  /**
   * Check if a checklist is outdated based on component hash
   */
  async isChecklistOutdated(checklist: ChecklistFile): Promise<boolean> {
    const currentHashResponse = await this.computeComponentHash(
      checklist.componentPath,
    );
    if (!currentHashResponse.exists) {
      return true; // Component file doesn't exist, consider outdated
    }
    return checklist.componentHash !== currentHashResponse.hash;
  }

  /**
   * Get all checklist files in the directory
   */
  async getAllChecklists(): Promise<ChecklistFile[]> {
    try {
      await this.ensureDirectoryExists();
      const files = await fs.readdir(this.checklistDir);
      const checklistFiles = files.filter((file: string) =>
        file.endsWith(".a11y.json"),
      );

      const checklists: ChecklistFile[] = [];
      for (const file of checklistFiles) {
        try {
          const storyId = file.replace(".a11y.json", "");
          const checklist = await this.loadChecklist(storyId);
          if (checklist) {
            checklists.push(checklist);
          }
        } catch (error) {
          console.warn(`Failed to load checklist file ${file}:`, error);
        }
      }

      return checklists;
    } catch (error) {
      console.error("Error getting all checklists:", error);
      return [];
    }
  }

  /**
   * Get outdated checklists (for CI/pre-commit checks)
   */
  async getOutdatedChecklists(): Promise<ChecklistFile[]> {
    const allChecklists = await this.getAllChecklists();
    const outdatedChecklists: ChecklistFile[] = [];

    for (const checklist of allChecklists) {
      const isOutdated = await this.isChecklistOutdated(checklist);
      if (isOutdated) {
        outdatedChecklists.push(checklist);
      }
    }

    return outdatedChecklists;
  }

  /**
   * Get checklists with failing items
   */
  async getFailingChecklists(): Promise<ChecklistFile[]> {
    const allChecklists = await this.getAllChecklists();
    return allChecklists.filter((checklist) =>
      checklist.results.some((result) => result.status === "fail"),
    );
  }
}
