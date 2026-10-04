#!/usr/bin/env bash
set -euo pipefail

CRM_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$CRM_ROOT"
command -v node >/dev/null || { echo "Нужен Node.js >=22."; exit 1; }
node -e "if (+process.versions.node.split('.')[0] < 22) process.exit(1)" || { echo "Нужен Node.js >=22."; exit 1; }

echo "Проверка проекта 4sales CRM"
npm run check
npm test

if [ -f public/index.html ]; then
  npm run build
else
  echo "Настройка готова. Код главной страницы ещё не создан; макеты и план подготовлены."
fi

if [ "${RUN_START_COMMAND:-0}" = "1" ]; then
  exec npm run dev
fi
echo "Запуск: npm run dev (http://localhost:5173)"
