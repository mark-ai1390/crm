import { readFile, readdir, stat, access } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
const root = resolve(import.meta.dirname, '..');
const queue = JSON.parse(await readFile(resolve(root, 'feature_list.json'), 'utf8'));
assert.equal(queue.project, '4sales CRM — Марк Сангинов');
assert(queue.features.length >= 8);
assert.equal(new Set(queue.features.map(f => f.id)).size, queue.features.length);
assert(queue.features.every(f => f.id.startsWith('crm-') && f.verification.length));
assert(queue.features.filter(f => f.status === 'in_progress').length <= 1);
const status = new Set(Object.keys(queue.status_legend));
for (const f of queue.features) {
  assert(status.has(f.status), 'Неизвестный статус: ' + f.id);
  if (f.status === 'passing') assert(f.evidence.length, 'Нет доказательств: ' + f.id);
}
async function walk(dir) {
  try { const files = await readdir(dir, { withFileTypes:true }); return (await Promise.all(files.map(f => f.isDirectory() ? walk(resolve(dir, f.name)) : [resolve(dir, f.name)]))).flat(); }
  catch (e) { if (e.code === 'ENOENT') return []; throw e; }
}
const files = [...await walk(resolve(root, 'scripts')), ...await walk(resolve(root, 'public'))];
for (const file of files) if (['.js','.mjs'].includes(extname(file))) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding:'utf8' });
  assert.equal(result.status, 0, result.stderr);
}
for (const file of files.filter(f => ['.html','.css'].includes(extname(f)))) {
  const text = await readFile(file,'utf8');
  assert(!text.includes('figma.com/api/mcp/asset'), 'Временный Figma URL: ' + file);
  const refs = extname(file) === '.html' ? [...text.matchAll(/(?:src|href)="([^"]+)"/g)].map(m => m[1]) : [...text.matchAll(/url\(['"]?([^)'"]+)/g)].map(m => m[1]);
  for (const ref of refs) {
    if (/^(?:https?:|data:|#|mailto:|tel:)/.test(ref)) continue;
    const target = ref.startsWith('/') ? resolve(root,'public','.'+ref.split(/[?#]/)[0]) : resolve(file,'..',ref.split(/[?#]/)[0]);
    await access(target);
    assert((await stat(target)).size > 0, 'Пустой ресурс: ' + ref);
  }
}
const exists = files.some(f => f.endsWith('/index.html'));
console.log(exists ? 'Проверки синтаксиса, структуры и локальных ресурсов пройдены.' : 'Настройка проверена. Код сайта ещё не создан.');
