export type ChecklistStatus = 'pass' | 'fail' | 'not_applicable' | 'unknown';
export type WCAGLevel = 'A' | 'AA' | 'AAA';

export interface WCAGGuideline {
  id: string;
  level: WCAGLevel;
  title: string;
  description: string;
  url: string;
}

export interface ChecklistItem {
  guidelineId: string;
  level: WCAGLevel;
  status: ChecklistStatus;
  reason?: string; // required if status === 'fail'
}

export interface ChecklistFile {
  version: string; // WCAG version
  storyId: string;
  componentName?: string;
  componentPath: string;
  componentHash: string;
  lastUpdated: string; // ISO 8601
  updatedBy?: string;
  results: ChecklistItem[];
  meta?: {
    notes?: string;
    generatedBy?: string;
  };
}

export interface AddonConfig {
  wcagVersion: string;
  checklistDir: string;
  requireReasonOnFail: boolean;
}

export interface ComponentHashResponse {
  hash: string;
  exists: boolean;
}

export interface SaveChecklistPayload {
  storyId: string;
  checklist: ChecklistFile;
}

export interface LoadChecklistResponse {
  checklist: ChecklistFile | null;
  isOutdated: boolean;
  currentHash: string;
}
