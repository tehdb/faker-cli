import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        dir: 'dist',
      },
    },
  },
  plugins: [
    VitePluginNode({
      adapter: 'node',
      appPath: './src/index.ts',
      exportName: 'default',
    }),
  ],
});
