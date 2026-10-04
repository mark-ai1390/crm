# 4sales CRM
Демонстрационная CRM Марка Сангинова для портфолио. Новый проект на основе макетов CRMED; начало работы — 4 октября 2026.

## Источники
- [Макеты Figma](https://www.figma.com/design/ufCGdzahHmwbLQWYjeAzNp/CRMED?node-id=1125-17038)
- [Новый дашборд](https://www.figma.com/design/ufCGdzahHmwbLQWYjeAzNp/CRMED?node-id=1478-35960)
- [План реализации](crm-implementation-plan.md)

## Запуск
Нужен Node.js 22 или новее. В проекте нет сторонних runtime-зависимостей.

```sh
./init.sh
npm run dev
```

Откройте http://localhost:5173. Для проверки и подготовки статики:
```sh
npm run check
npm test
npm run build
npm run preview
```

Исходники сайта находятся в public/, результат сборки — dist/. Порт сервера можно изменить: PORT=3000 npm run dev.

## Статус
Макеты и план подготовлены. На исходной точке настройки код нового сайта отсутствует. Актуальный статус и результаты проверок — в [claude-progress.md](claude-progress.md); очередь задач — в [feature_list.json](feature_list.json).

Данные и операции CRM демонстрационные. Полноценный сервер и внешние интеграции входят в отдельный объём.
