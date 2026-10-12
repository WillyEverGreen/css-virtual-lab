import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

function experimentsPlugin() {
  return {
    name: 'experiments-plugin',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        if (req.url && req.url.startsWith('/experiments/')) {
          const cleanUrl = decodeURIComponent(req.url.split('?')[0]);
          let targetPath = path.join(process.cwd(), cleanUrl);
          if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
            targetPath = path.join(targetPath, 'index.html');
          }
          if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
            const ext = path.extname(targetPath);
            const mimeTypes: Record<string, string> = {
              '.html': 'text/html; charset=utf-8',
              '.css': 'text/css; charset=utf-8',
              '.js': 'application/javascript; charset=utf-8',
              '.json': 'application/json; charset=utf-8',
              '.svg': 'image/svg+xml',
              '.png': 'image/png',
            };
            res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
            return fs.createReadStream(targetPath).pipe(res);
          }
        }
        next();
      });
    },
    closeBundle() {
      const srcDir = path.resolve(process.cwd(), 'experiments');
      const destDir = path.resolve(process.cwd(), 'dist/experiments');
      if (fs.existsSync(srcDir)) {
        fs.cpSync(srcDir, destDir, { recursive: true });
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), experimentsPlugin()],
  server: {
    proxy: {
      '/api': {
        target: 'https://crypto-virtual-lab.collacou.workers.dev',
        changeOrigin: true,
      },
    },
  },
});


