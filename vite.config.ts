import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";

// Define entries by their target environment
const browserEntries = {
  index: resolve(__dirname, "src/index.ts"),
  manager: resolve(__dirname, "src/manager.tsx"),
  preview: resolve(__dirname, "src/preview.ts"),
};

const nodeEntries = {
  preset: resolve(__dirname, "src/preset.ts"),
  server: resolve(__dirname, "src/server.ts"),
  "cli/index": resolve(__dirname, "src/cli/index.ts"),
};

const allEntries = { ...browserEntries, ...nodeEntries };

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ["src/**/*"],
      exclude: ["**/*.stories.*", "**/*.test.*"],
      outDir: "dist",
    }),
  ],
  build: {
    outDir: "dist",
    lib: {
      entry: allEntries,
      formats: ["es", "cjs"],
      fileName: (format, entryName) => {
        const ext = format === "es" ? ".js" : ".cjs";
        return `${entryName}${ext}`;
      },
    },
    rollupOptions: {
      external: (id) => {
        // External for all Storybook-related packages
        if (
          id.startsWith("storybook") ||
          id.startsWith("@storybook") ||
          id === "react" ||
          id === "react-dom"
        ) {
          return true;
        }

        // External for Node.js built-ins
        if (
          id === "fs" ||
          id === "path" ||
          id === "crypto" ||
          id === "util" ||
          id === "child_process" ||
          id.startsWith("node:") ||
          id === "express" ||
          id === "cors" ||
          id === "commander" ||
          id === "zod"
        ) {
          return true;
        }

        return false;
      },
      output: [
        {
          format: "es",
          entryFileNames: "[name].js",
        },
        {
          format: "cjs",
          entryFileNames: "[name].cjs",
        },
      ],
    },
    sourcemap: true,
    minify: false,
  },
});
