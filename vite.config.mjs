import { resolve } from 'path';
import { readFileSync } from 'fs';
import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';
import banner from 'vite-plugin-banner';

const packageJsonPath = resolve(__dirname, 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
const packageName = packageJson.name;
const packageVersion = packageJson.version;

export default defineConfig({
  define: {
    PACKAGE_NAME: JSON.stringify(packageName),
    PACKAGE_VERSION: JSON.stringify(packageVersion),
  },
  plugins: [
    VitePluginNode({
      adapter: 'node',
      appPath: './src/index.ts',
      exportName: 'default',
    }),

    banner({
      content: `#!/usr/bin/env node`,
      verify: false,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        dir: 'dist',
      },
    },
  },
});
