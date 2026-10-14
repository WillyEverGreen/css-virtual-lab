import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

function experimentsPlugin() {
  return {
    name: 'experiments-plugin',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        if (req.url && req.url.startsWith('/api/feedback')) {
          const feedbackPath = path.resolve(process.cwd(), 'public/data/feedback.json');
          const srcFeedbackPath = path.resolve(process.cwd(), 'src/shared/data/feedback.json');

          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk: any) => { body += chunk; });
            req.on('end', () => {
              try {
                const newEntry = JSON.parse(body);
                let list: any[] = [];
                if (fs.existsSync(feedbackPath)) {
                  try { list = JSON.parse(fs.readFileSync(feedbackPath, 'utf-8')); } catch (_) {}
                }
                const entryWithId = {
                  id: newEntry.id || `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                  ...newEntry,
                  receivedAt: new Date().toISOString(),
                };
                list.unshift(entryWithId);
                fs.mkdirSync(path.dirname(feedbackPath), { recursive: true });
                fs.writeFileSync(feedbackPath, JSON.stringify(list, null, 2), 'utf-8');

                try {
                  fs.mkdirSync(path.dirname(srcFeedbackPath), { recursive: true });
                  fs.writeFileSync(srcFeedbackPath, JSON.stringify(list, null, 2), 'utf-8');
                } catch (_) {}

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, entry: entryWithId, total: list.length }));
                return;
              } catch (_) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
                return;
              }
            });
            return;
          }

          if (req.method === 'GET') {
            let list = [];
            if (fs.existsSync(feedbackPath)) {
              try { list = JSON.parse(fs.readFileSync(feedbackPath, 'utf-8')); } catch (_) {}
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(list));
            return;
          }
        }

        if (req.url && req.url.startsWith('/experiments/')) {
          const cleanUrl = decodeURIComponent(req.url.split('?')[0]);
          const ext = path.extname(cleanUrl);
          if (ext && ['.html', '.css', '.js', '.json', '.svg', '.png'].includes(ext)) {
            const targetPath = path.join(process.cwd(), cleanUrl);
            if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
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


