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
  componentId: z.string(),
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
  private projectRoot: string;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }



  /**
   * Get the file path for a component's checklist based on the component's actual file path
   * This places the checklist file next to the story file
   */
  private getChecklistFilePath(componentPath: string): string {
    // Extract directory from component path and place .a11y.json file there
    const componentDir = componentPath.substring(0, componentPath.lastIndexOf('/'));
    const fileName = componentPath.substring(componentPath.lastIndexOf('/') + 1);
    const baseFileName = fileName.replace(
      /\.(tsx?|jsx?|vue|stories\.(tsx?|jsx?|js|ts|vue))$/i,
      "",
    );
    return resolve(this.projectRoot, componentDir, `${baseFileName}.a11y.json`);
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
   * Load a checklist file for a component
   */
  async loadChecklist(componentId: string, componentPath: string): Promise<ChecklistFile | null> {
    try {
      const filePath = this.getChecklistFilePath(componentPath);
      const content = await fs.readFile(filePath, "utf-8");
      const data = JSON.parse(content);

      // Validate the data structure
      const validated = ChecklistFileSchema.parse(data);
      return validated;
    } catch (error) {
      if ((error as any).code === "ENOENT") {
        return null; // File doesn't exist
      }
      console.error(`Error loading checklist for ${componentId}:`, error);
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

      const filePath = this.getChecklistFilePath(checklist.componentPath);
      
      // Ensure the directory exists for the file path
      const fileDir = filePath.substring(0, filePath.lastIndexOf('/'));
      try {
        await fs.access(fileDir);
      } catch {
        await fs.mkdir(fileDir, { recursive: true });
      }

      // Update metadata
      const updatedChecklist: ChecklistFile = {
        ...checklist,
        lastUpdated: new Date().toISOString(),
        meta: {
          ...checklist.meta,
          generatedBy: `storybook-addon-a11y-checklist@1.0.0`,
        },
      };

      const content = JSON.stringify(updatedChecklist, null, 2);
      await fs.writeFile(filePath, content, "utf-8");
    } catch (error) {
      console.error(
        `Error saving checklist for ${checklist.componentId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Create a default checklist template for a component
   */
  async createDefaultChecklist(
    componentId: string,
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
      componentId,
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
   * Recursively find all .a11y.json files in the project
   */
  private async findAllChecklistFiles(dir: string = this.projectRoot): Promise<string[]> {
    const files: string[] = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        
        if (entry.isDirectory()) {
          // Skip node_modules and other common build/cache directories
          if (!['node_modules', '.git', 'dist', 'build', '.next', '.storybook-static'].includes(entry.name)) {
            const subdirFiles = await this.findAllChecklistFiles(fullPath);
            files.push(...subdirFiles);
          }
        } else if (entry.name.endsWith('.a11y.json')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Ignore permission errors or other issues with specific directories
    }
    
    return files;
  }

  /**
   * Get all checklist files in the project (co-located with stories)
   */
  async getAllChecklists(): Promise<ChecklistFile[]> {
    try {
      // Find all .a11y.json files co-located with stories
      const checklistFiles = await this.findAllChecklistFiles();

      const checklists: ChecklistFile[] = [];
      for (const filePath of checklistFiles) {
        try {
          const content = await fs.readFile(filePath, "utf-8");
          const data = JSON.parse(content);
          const validated = ChecklistFileSchema.parse(data);
          checklists.push(validated);
        } catch (error) {
          console.warn(`Failed to load checklist file ${filePath}:`, error);
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
