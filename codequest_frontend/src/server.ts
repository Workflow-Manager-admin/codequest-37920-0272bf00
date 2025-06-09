import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CommonEngine, isMainModule } from '@angular/ssr/node';
import bootstrap from './main.server';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

const app = express();
const commonEngine = new CommonEngine();

/**
 * Serve static files from the /browser build output.
 * Any asset (JS, CSS, images, etc) will be served directly.
 */
app.get(
  '*.*',
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false
  }),
);

/**
 * All other routes handled by SSR: use Angular's CommonEngine to render the app.
 */
app.get('*', (req, res, next) => {
  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: req.originalUrl,
      publicPath: browserDistFolder,
    })
    .then(html => res.send(html))
    .catch(err => next(err));
});

/**
 * Start the server only if this file is run directly (not required/imported as a module).
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express SSR server listening on http://localhost:${port}`);
  });
}

export default app;
