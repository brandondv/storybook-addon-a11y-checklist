/**
 * Preview configuration for the A11Y Checklist addon.
 * This file defines how the addon behaves in the Storybook preview environment.
 */
import type { ProjectAnnotations, Renderer } from "storybook/internal/types";

const preview: ProjectAnnotations<Renderer> = {
  decorators: [],
  // No global state needed for panel-only addon
};

export default preview;
