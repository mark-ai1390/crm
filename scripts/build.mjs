import { cp, mkdir, rm, access } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
try { await access(resolve(root, 'public/index.html')); }
catch { throw new Error('Код сайта ещё не создан. Следующий этап — главная страница по Figma.'); }
await rm(resolve(root, 'dist'), { recursive: true, force: true });
await mkdir(resolve(root, 'dist'), { recursive: true });
await cp(resolve(root, 'public'), resolve(root, 'dist'), { recursive: true });
console.log('Сайт собран в dist/.');
