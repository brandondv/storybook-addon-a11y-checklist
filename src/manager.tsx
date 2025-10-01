import React from "react";
import { addons, types } from "storybook/manager-api";

import { Panel } from "./components/Panel";
import { ADDON_ID, PANEL_ID } from "./constants";

// Register the addon
addons.register(ADDON_ID, (api) => {
  // Register the A11Y Checklist panel
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: "A11Y Checklist",
    match: ({ viewMode }) => viewMode === "story",
    render: ({ active }) => <Panel active={active || false} />,
  });
});
