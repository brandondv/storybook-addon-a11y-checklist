export const STATUS_COLORS = {
  pass: "#1f7c34ff",
  fail: "#dc3545",
  not_applicable: "#6c757d",
  unknown: "#ff8400ff",
} as const;

export const STATUS_LABELS = {
  pass: "Pass",
  fail: "Fail",
  not_applicable: "N/A",
  unknown: "Unknown",
} as const;

export const LEVEL_COLORS = {
  A: "#008e34ff",     // Light green
  AA: "#006324ff",    // Medium green  
  AAA: "#003714ff",   // Dark green
} as const;

export type StatusKey = keyof typeof STATUS_COLORS;
export type LevelKey = keyof typeof LEVEL_COLORS;