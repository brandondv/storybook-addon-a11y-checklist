import { defineMain } from "@storybook/react-vite/node";

const config = defineMain({
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-docs", "./local-preset.cjs"],
  framework: "@storybook/react-vite",
  staticDirs: [
    // Include a11y checklist files in the build for offline/readonly mode
    {
      from: '../src',
      to: '/src'
    }
  ],
  viteFinal: async (config) => {
    // Include .a11y.json files in the build as assets
    if (config.assetsInclude) {
      if (typeof config.assetsInclude === 'string') {
        config.assetsInclude = [config.assetsInclude, '**/*.a11y.json'];
      } else if (Array.isArray(config.assetsInclude)) {
        config.assetsInclude.push('**/*.a11y.json');
      }
    } else {
      config.assetsInclude = ['**/*.a11y.json'];
    }
    
    return config;
  },
});

export default config;
