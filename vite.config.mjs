import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';
import banner from 'vite-plugin-banner';

export default defineConfig({
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
        dir: 'dist'
      }
    },
  },
});
