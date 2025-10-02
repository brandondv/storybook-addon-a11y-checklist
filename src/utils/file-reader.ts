/**
 * Client-side file reader for checklist files when API server is unavailable
 * This allows read-only access to stored checklists in production builds
 */

import type { ChecklistFile } from "../types";

export class ChecklistFileReader {
  private checklistsCache = new Map<string, ChecklistFile>();
  private isServerAvailable: boolean | null = null;

  /**
   * Check if the API server is available
   */
  async checkServerAvailability(): Promise<boolean> {
    if (this.isServerAvailable !== null) {
      return this.isServerAvailable;
    }

    try {
      // Try to reach the health endpoint with a short timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

      // Try the standalone server health endpoint first
      const response = await fetch('http://localhost:3001/health', {
        signal: controller.signal,
        cache: 'no-cache'
      });
      
      clearTimeout(timeoutId);
      this.isServerAvailable = response.ok;
      return this.isServerAvailable;
    } catch (error) {
      // Server is not available (network error, timeout, etc.)
      this.isServerAvailable = false;
      return false;
    }
  }

  /**
   * Attempt to dynamically import a checklist file
   * This works when the checklist files are included in the build
   */
  async importChecklistFile(componentId: string, componentPath: string): Promise<ChecklistFile | null> {
    const cacheKey = `${componentId}:${componentPath}`;
    
    if (this.checklistsCache.has(cacheKey)) {
      return this.checklistsCache.get(cacheKey)!;
    }

    try {
      const possiblePaths = this.generateChecklistPaths(componentPath);

      for (const path of possiblePaths) {
        try {
          const response = await fetch(path, { cache: "no-cache" });
          if (response.ok) {
            const checklist: ChecklistFile = await response.json();
            this.checklistsCache.set(cacheKey, checklist);
            return checklist;
          }
        } catch (error) {
          // Continue to next path
          continue;
        }
      }

      return null;
    } catch (error) {
      console.warn(`Failed to import checklist file for ${componentId}:`, error);
      return null;
    }
  }

  /**
   * Generate possible paths for checklist files based on component path
   * This handles story-adjacent file placement
   */
  private generateChecklistPaths(componentPath: string): string[] {
    if (!componentPath) return [];

    // Normalize the component path to handle different formats
    const normalizedPath = componentPath.startsWith('./') ? componentPath.slice(2) : componentPath;
    const pathWithoutExtension = normalizedPath.replace(/\.(tsx?|jsx?|vue|stories\.(tsx?|jsx?|js|ts|vue))$/i, '');
    
    // Get directory and filename parts
    const lastSlashIndex = pathWithoutExtension.lastIndexOf('/');
    const directory = lastSlashIndex >= 0 ? pathWithoutExtension.substring(0, lastSlashIndex) : '';
    const filename = lastSlashIndex >= 0 ? pathWithoutExtension.substring(lastSlashIndex + 1) : pathWithoutExtension;
    
    const paths: string[] = [];
    
    // Try story-adjacent paths in the build output
    if (directory) {
      // Path with full directory structure: /src/components/Button/Button.a11y.json
      paths.push(`/${directory}/${filename}.a11y.json`);
      // Path without src prefix: /components/Button/Button.a11y.json
      const withoutSrc = directory.replace(/^src\//, '');
      if (withoutSrc !== directory) {
        paths.push(`/${withoutSrc}/${filename}.a11y.json`);
      }
    } else {
      // Root level: /Button.a11y.json
      paths.push(`/${filename}.a11y.json`);
    }
    
    return paths;
  }

  /**
   * Try to load checklist files from the build assets
   * This requires the files to be included in the Storybook build
   */
  async loadChecklistFromAssets(componentId: string, componentPath: string): Promise<ChecklistFile | null> {
    try {
      // First check if server is available
      const serverAvailable = await this.checkServerAvailability();
      if (serverAvailable) {
        // Server is available, don't use file reader
        return null;
      }

      // Server is not available, try to read from static files
      return await this.importChecklistFile(componentId, componentPath);
    } catch (error) {
      console.warn('Failed to load checklist from assets:', error);
      return null;
    }
  }

  /**
   * Clear the cache (useful for testing or when files are updated)
   */
  clearCache(): void {
    this.checklistsCache.clear();
    this.isServerAvailable = null;
  }

  /**
   * Get all cached checklists
   */
  getCachedChecklists(): Map<string, ChecklistFile> {
    return new Map(this.checklistsCache);
  }
}

// Singleton instance
export const checklistFileReader = new ChecklistFileReader();