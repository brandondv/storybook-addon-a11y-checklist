import type { ChecklistFile, ChecklistItem, WCAGGuideline, ChecklistStatus, WCAGLevel } from '../types';
import { getGuidelinesByVersion } from '../data/wcag-guidelines';
import { DEFAULT_CONFIG } from '../constants';
import { checklistFileReader } from "./file-reader";

export class ChecklistClientManager {
  private baseUrl: string;
  private readOnlyMode: boolean = false;

  constructor(baseUrl: string = "http://localhost:3001/api") {
    this.baseUrl = baseUrl;
  }

  /**
   * Load a checklist from the server or fallback to local files
   */
  async loadChecklist(
    componentId: string,
    componentPath: string,
    wcagVersion: string = DEFAULT_CONFIG.wcagVersion,
  ): Promise<{
    checklist: ChecklistFile | null;
    isOutdated: boolean;
    currentHash: string;
    readOnlyMode?: boolean;
  }> {
    try {
      // First try to load from server
      const params = new URLSearchParams({
        componentPath,
        wcagVersion,
      });

      const response = await fetch(
        `${this.baseUrl}/a11y-checklist/${componentId}?${params}`,
        {
          // Add timeout to fail fast if server is not available
          signal: AbortSignal.timeout(3000), // Reduced timeout for faster fallback
        },
      );

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const result = await response.json();
      this.readOnlyMode = false;
      return result;
    } catch (error) {
      console.warn(
        `API server not available, switching to read-only mode:`,
        error,
      );

      // Fallback to file reader
      this.readOnlyMode = true;
      const fallbackChecklist =
        await checklistFileReader.loadChecklistFromAssets(
          componentId,
          componentPath,
        );

      if (fallbackChecklist) {
        return {
          checklist: fallbackChecklist,
          isOutdated: false, // Can't determine if outdated without server
          currentHash: "", // No hash available in read-only mode
          readOnlyMode: true,
        };
      }

      // If no stored checklist found, create a default one but mark as read-only
      const defaultChecklist = this.createDefaultChecklist(
        componentId,
        componentPath,
        undefined,
        wcagVersion,
      );
      return {
        checklist: defaultChecklist,
        isOutdated: false,
        currentHash: "",
        readOnlyMode: true,
      };
    }
  }

  /**
   * Save a checklist to the server (only works when not in read-only mode)
   */
  async saveChecklist(
    componentId: string,
    checklist: ChecklistFile,
  ): Promise<{ success: boolean; hash?: string; message?: string }> {
    if (this.readOnlyMode) {
      throw new Error(
        "Cannot save checklist in read-only mode. API server is not available.",
      );
    }

    const response = await fetch(
      `${this.baseUrl}/a11y-checklist/${componentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ componentId, checklist }),
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to save checklist: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Create a default checklist template for a component
   */
  createDefaultChecklist(
    componentId: string,
    componentPath: string,
    componentName?: string,
    wcagVersion: string = DEFAULT_CONFIG.wcagVersion,
  ): ChecklistFile {
    const guidelines = getGuidelinesByVersion(wcagVersion);

    const results: ChecklistItem[] = guidelines.map((guideline) => ({
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
      componentHash: "", // Will be computed by server
      lastUpdated: new Date().toISOString(),
      results,
      meta: {
        notes: "",
        generatedBy: `storybook-addon-a11y-checklist@1.0.0`,
      },
    };
  }

  /**
   * Get component hash from server
   */
  async getComponentHash(
    componentPath: string,
  ): Promise<{ hash: string; exists: boolean }> {
    if (this.readOnlyMode) {
      return { hash: "", exists: false };
    }

    const params = new URLSearchParams({ componentPath });
    const response = await fetch(
      `${this.baseUrl}/a11y-component-hash?${params}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to get component hash: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Check if the client is in read-only mode (API server unavailable)
   */
  isReadOnlyMode(): boolean {
    return this.readOnlyMode;
  }

  /**
   * Force read-only mode (useful for testing or production builds)
   */
  setReadOnlyMode(readOnly: boolean): void {
    this.readOnlyMode = readOnly;
  }
}