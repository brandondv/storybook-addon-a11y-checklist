// Main exports for the addon - client-side safe exports only
export { ChecklistClientManager } from "./utils/client-manager";
export type {
  ChecklistFile,
  ChecklistItem,
  ChecklistStatus,
  WCAGGuideline,
  WCAGLevel,
  AddonConfig,
  ComponentHashResponse,
  SaveChecklistPayload,
  LoadChecklistResponse,
} from "./types";
export {
  getGuidelinesByVersion,
  getGuidelineById,
} from "./data/wcag-guidelines";
export { DEFAULT_CONFIG } from "./constants";

// Note: Server-side utilities (ChecklistManager, A11yChecklistServer) are available
// through separate imports for Node.js environments:
// import { ChecklistManager } from 'storybook-addon-a11y-checklist/server';
