# Соответствия дизайн-системы и кода

Figma: https://www.figma.com/design/qgfY24y8o8Z4Xa3ZsmWq8N/CRMED--Copy-?node-id=3018-18792

| Компонент Figma | Реализация | Варианты / состояние |
|---|---|---|
| Button 3019:18769 | ui.js `button` + .button | primary, secondary, ghost, danger; hover/focus/disabled |
| IconButton 3019:18786 | .icon-button | доступная подпись, hover/focus/disabled |
| Field 3019:18799 | ui.js field/select/textarea | пустое/filled, focus, disabled, native invalid + form-error |
| Badge 3019:18810 | ui.js badge/statusBadge/paymentBadge | neutral, blue, success, warning, danger |
| Checkbox 3019:18817 | ui.js check + input checkbox | checked/default/disabled; выбор строк |
| Switch 3019:18824 | views.js .switch | правила on/off/disabled |
| Avatar 3019:18829 | ui.js avatar | инициалы, круг 36 px |
| NavItem 3019:18860 | app.js shell / .nav-item | expanded/compact, current/hover/focus |
| Tab 3019:18867 | ui.js tabs | текущий URL, aria-current |
| TableRow 3019:18910 | ui.js table | 56/42 px, hover/selected, checkbox |
| KPI 3019:18919 | views.js overview / .kpi | accent/default, показатели из store |
| Card 3019:18920 | ui.js card | заголовок, действия, произвольное содержимое |
| Modal 3019:18923 | forms.js modal + native dialog | клавиатура, ошибки, сохранение ввода |
| Drawer 3019:18927 | dialog.drawer | preview, фильтры, уведомления |
| EmptyState 3019:18931 | ui.js empty | пустой набор / нет результатов / не найдено |
| Toast 3019:18934 | app.js toast | live-region, результат / ошибка |
| TimelineEvent 3019:18937 | views.js orderDetail / .timeline-event | оплата, статус, заметка, сообщение, задача |
| SearchResult 3019:18940 | app.js search / .search-result | клавиатурный выбор, ссылки на записи |
| Tooltip 3019:18943 | title + доступные подписи контролов | причина disabled, название compact-nav |
| Skeleton 3019:18945 | #boot-message role=status | краткая загрузка локального приложения; искусственные задержки не добавлены |
| Sidebar 3020:18887 | app.js shell / .sidebar | 228/88 px, mobile drawer, профиль снизу 20 px |

Иконки: точный SVG-экспорт созданных компонентов в public/assets/v2/icons/. График динамический и строится из подтверждённых платежей; изображение макета не используется как интерфейс.

Семантические CSS-переменные совпадают с WEB code syntax в Figma. Два цвета уточнены по контрасту: text-secondary #607087, status-success #087B63.

Это документированное соответствие исходному коду. **Code Connect не опубликован:** connected API вернул ограничение плана/seat Figma. Файлы, имитирующие успешную публикацию Code Connect, не создавались.
