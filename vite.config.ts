import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://crypto-virtual-lab.collacou.workers.dev',
        changeOrigin: true,
      },
      '^/experiments/[^/]+/.+': {
        target: 'https://crypto-virtual-lab.collacou.workers.dev',
        changeOrigin: true,
        bypass(req) {
          const pathname = req.url ? req.url.split('?')[0] : '';
          const localFile = path.join(process.cwd(), 'public', pathname);
          if (fs.existsSync(localFile) && fs.statSync(localFile).isFile()) {
            return req.url;
          }
        },
      },
    },
  },
});


