import { defineConfig, type UserConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { existsSync, readFileSync } from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export default defineConfig(({ command }): UserConfig => {
  const isDev = command === 'serve';

  // Resolve path to @aiready/components for alias
  // Try monorepo first, then fall back to installed package
  let componentsPath = resolve(__dirname, '../../components/src');
  if (!existsSync(componentsPath)) {
    // Fallback: try installed package
    try {
      // Use synchronous resolve
      componentsPath = resolve(
        require.resolve('@aiready/components'),
        '../../src'
      );
    } catch (e) {
      // Use build dist as last resort
      componentsPath = resolve(__dirname, '../../components/dist');
    }
  }

  const plugins: any[] = [react()];

  // Dev-time middleware
  const reportProxyPlugin = {
    name: 'aiready-report-proxy',
    configureServer(server: any) {
      const reportPath = process.env.AIREADY_REPORT_PATH;
      const visualizerConfigStr = process.env.AIREADY_VISUALIZER_CONFIG;
      if (!reportPath) return;

      server.middlewares.use((req: any, res: any, next: any) => {
        const url = req.url || '';
        if (url === '/report-data.json' || url.startsWith('/report-data.json?')) {
          try {
            if (!existsSync(reportPath)) {
              res.statusCode = 404;
              res.setHeader('Content-Type', 'text/plain; charset=utf-8');
              res.end('Report not found');
              return;
            }
            const data = readFileSync(reportPath, 'utf8');
            const report = JSON.parse(data);

            if (visualizerConfigStr) {
              try {
                const visualizerConfig = JSON.parse(visualizerConfigStr);
                report.visualizerConfig = visualizerConfig;
              } catch (e) {}
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify(report));
            return;
          } catch (e) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end('Error reading report');
            return;
          }
        }
        next();
      });
    },
  };
  plugins.push(reportProxyPlugin);

  return {
    plugins,
    build: {
      outDir: 'dist',
      minify: false,
      sourcemap: true,
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
    server: {
      open: false,
    },
    resolve: {
      alias: isDev
        ? {
            '@aiready/components': componentsPath,
          }
        : ({} as Record<string, string>),
    },
  };
});
