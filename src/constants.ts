export const ADDON_ID = "storybook-addon-a11y-checklist";
export const PANEL_ID = `${ADDON_ID}/panel`;

export const EVENTS = {
  RESULT: `${ADDON_ID}/result`,
  REQUEST: `${ADDON_ID}/request`,
  LOAD_CHECKLIST: `${ADDON_ID}/load-checklist`,
  SAVE_CHECKLIST: `${ADDON_ID}/save-checklist`,
  GET_COMPONENT_HASH: `${ADDON_ID}/get-component-hash`,
};

export const DEFAULT_CONFIG = {
  wcagVersion: "2.2",
  checklistDir: "a11y-checklists",
  requireReasonOnFail: true,
} as const;
