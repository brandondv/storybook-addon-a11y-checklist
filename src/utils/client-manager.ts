import type { ChecklistFile, ChecklistItem, WCAGGuideline, ChecklistStatus, WCAGLevel } from '../types';
import { getGuidelinesByVersion } from '../data/wcag-guidelines';
import { DEFAULT_CONFIG } from '../constants';

export class ChecklistClientManager {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3001/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * Load a checklist from the server
   */
  async loadChecklist(storyId: string, componentPath: string, wcagVersion: string = DEFAULT_CONFIG.wcagVersion): Promise<{
    checklist: ChecklistFile | null;
    isOutdated: boolean;
    currentHash: string;
  }> {
    const params = new URLSearchParams({
      componentPath,
      wcagVersion,
    });

    const response = await fetch(`${this.baseUrl}/a11y-checklist/${storyId}?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to load checklist: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Save a checklist to the server
   */
  async saveChecklist(storyId: string, checklist: ChecklistFile): Promise<{ success: boolean; hash?: string; message?: string }> {
    const response = await fetch(`${this.baseUrl}/a11y-checklist/${storyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ storyId, checklist }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save checklist: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Create a default checklist template for a story
   */
  createDefaultChecklist(
    storyId: string,
    componentPath: string,
    componentName?: string,
    wcagVersion: string = DEFAULT_CONFIG.wcagVersion
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
      storyId,
      componentName,
      componentPath,
      componentHash: '', // Will be computed by server
      lastUpdated: new Date().toISOString(),
      results,
      meta: {
        notes: '',
        generatedBy: `storybook-addon-a11y-checklist@1.0.0`,
      },
    };
  }

  /**
   * Get component hash from server
   */
  async getComponentHash(componentPath: string): Promise<{ hash: string; exists: boolean }> {
    const params = new URLSearchParams({ componentPath });
    const response = await fetch(`${this.baseUrl}/a11y-component-hash?${params}`);
    
    if (!response.ok) {
      throw new Error(`Failed to get component hash: ${response.statusText}`);
    }

    return response.json();
  }
}