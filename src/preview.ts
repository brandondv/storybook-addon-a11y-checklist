/**
 * Preview configuration for the A11Y Checklist addon.
 * This file defines how the addon behaves in the Storybook preview environment.
 */
import type { ProjectAnnotations, Renderer } from "storybook/internal/types";

import { KEY } from "./constants";

const preview: ProjectAnnotations<Renderer> = {
  decorators: [],
  initialGlobals: {
    [KEY]: false,
  },
};

export default preview;
