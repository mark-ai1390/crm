import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
const root = resolve(process.argv[2] || 'public');
const port = Number(process.env.PORT || 5173);
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.woff2':'font/woff2', '.ico':'image/x-icon' };
createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const path = resolve(root, '.' + decodeURIComponent(url.pathname));
    if (path !== root && !path.startsWith(root + sep)) { res.writeHead(403); res.end(); return; }
    const info = await stat(path);
    const file = info.isDirectory() ? resolve(path, 'index.html') : path;
    const bytes = await readFile(file);
    res.writeHead(200, { 'content-type': mime[extname(file)] || 'application/octet-stream', 'cache-control':'no-cache' });
    res.end(bytes);
  } catch { res.writeHead(404, { 'content-type':'text/plain; charset=utf-8' }); res.end('Страница не найдена'); }
}).listen(port, '0.0.0.0', () => console.log('4sales CRM: http://localhost:' + port));
