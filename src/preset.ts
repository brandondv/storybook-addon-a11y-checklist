import { A11yChecklistServer } from "./utils/server";
import { DEFAULT_CONFIG } from "./constants";

export interface A11yChecklistOptions {
  wcagVersion?: string;
  requireReasonOnFail?: boolean;
}

export const managerEntries = [require.resolve("./manager")];

// Storybook middleware for handling API requests
export const middleware = (router: any) => {
  const projectRoot = process.cwd();

  const server = new A11yChecklistServer({
    projectRoot,
  });

  server.setupRoutes(router);
};
