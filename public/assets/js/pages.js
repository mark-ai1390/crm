const money=new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB',maximumFractionDigits:0});
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const orders=[
  ['134678','29.11.2025, 17:30','Макаров В.','Сергей М.','12 000 ₽','В пути','Ожидает'],
  ['134742','21.05.2026, 10:18','Сангинов М.','Анна Котова','24 000 ₽','В работе','Оплачен'],
  ['134759','21.05.2026, 09:42','Марина Ф.','Мария Савина','8 490 ₽','Новый','Ожидает'],
  ['134761','20.05.2026, 18:05','Алексей М.','Илья Борисов','17 800 ₽','В пути','Оплачен'],
  ['134765','20.05.2026, 16:12','Макаров В.','Елена Волкова','6 590 ₽','Отменён','Возврат'],
  ['134771','20.05.2026, 14:40','Игорь Л.','Павел Орлов','31 200 ₽','В работе','Оплачен'],
  ['134776','20.05.2026, 12:33','Сангинов М.','Олег Миронов','14 300 ₽','Новый','Ожидает'],
  ['134781','19.05.2026, 19:08','Марина Ф.','Дарья Белова','9 950 ₽','В пути','Оплачен']
];
const clients=[
  ['Мария Савина','Активен','+7 903 123-45-67','m.savina@mail.ru','12','84 600 ₽','21.05.2026'],
  ['Анна Котова','Активен','+7 916 224-70-18','anna.kotova@mail.ru','8','63 250 ₽','21.05.2026'],
  ['Сергей Михайлов','Активен','+7 985 442-18-90','sergey.m@mail.ru','5','48 900 ₽','20.05.2026'],
  ['Илья Борисов','Активен','+7 999 104-34-01','borisov.i@mail.ru','3','27 800 ₽','20.05.2026'],
  ['Елена Волкова','Не активен','+7 901 548-82-13','volkova.e@mail.ru','1','6 590 ₽','18.05.2026'],
  ['Павел Орлов','Активен','+7 977 382-44-51','p.orlov@mail.ru','7','91 400 ₽','17.05.2026'],
  ['Олег Миронов','Новый','+7 903 671-24-70','mironov.o@mail.ru','1','14 300 ₽','16.05.2026'],
  ['Дарья Белова','Активен','+7 925 230-55-42','d.belova@mail.ru','4','39 950 ₽','15.05.2026']
];
const emails=[
  ['Анна Котова','Промо-рассылка: Весенняя коллекция','Макаров В.','Email','Отправлено','21.05.2026, 10:41'],
  ['Мария Савина','Напоминание о брошенной корзине','Сангинов М.','Email','Ожидает','21.05.2026, 10:32'],
  ['Сергей Михайлов','Подтверждение заказа #134742','Марина Ф.','Email','Отправлено','21.05.2026, 10:20'],
  ['Илья Борисов','Заказ передан в доставку','Алексей М.','Email','Отправлено','21.05.2026, 09:54'],
  ['Елена Волкова','Не удалось доставить письмо','Макаров В.','Email','Ошибка','21.05.2026, 09:31'],
  ['Павел Орлов','Ваш чек по заказу #134771','Игорь Л.','Email','Отправлено','20.05.2026, 18:28']
];
const sms=[
  ['Анна Котова','Ваш заказ #134759 передан в доставку','Макаров В.','СМС','Отправлено','21.05.2026, 10:41'],
  ['Мария Савина','Код подтверждения: 4832','Сангинов М.','СМС','Отправлено','21.05.2026, 10:32'],
  ['Сергей Михайлов','Скидка 10% действует до конца дня','Марина Ф.','СМС','Ожидает','21.05.2026, 10:20'],
  ['Илья Борисов','Курьер будет у вас с 14:00 до 16:00','Алексей М.','СМС','Отправлено','21.05.2026, 09:54'],
  ['Елена Волкова','Сообщение не доставлено','Макаров В.','СМС','Ошибка','21.05.2026, 09:31'],
  ['Павел Орлов','Заказ готов к выдаче','Игорь Л.','СМС','Отправлено','20.05.2026, 18:28']
];
const products=[
  ['Радиоуправляемая машина УАЗ 469 зелёный 1:12','82929','Техника','Оприходован','4 590 ₽','4 290 ₽','12'],
  ['Double Eagle JEEP Wrangler Rubicon 1:9','CW2288-111','Машины','Оприходован','12 000 ₽','10 990 ₽','8'],
  ['Квадрокоптер Syma X5HW','SY-X5HW','Квадрокоптеры','Ожидает','8 490 ₽','7 990 ₽','3'],
  ['Катер Fei Lun FT012 2.4G','FT012-BLUE','Катера','Оприходован','14 300 ₽','13 590 ₽','5'],
  ['Танк Heng Long Tiger I 1:16','HL-3818','Танки','Черновик','31 200 ₽','29 900 ₽','0'],
  ['Аккумулятор LiPo 7.4V 1500mAh','LIPO-7415','Аксессуары','Оприходован','2 190 ₽','1 990 ₽','28'],
  ['Пульт управления FlySky FS-i6','FS-I6','Аппаратура','Ожидает','9 950 ₽','9 450 ₽','2'],
  ['Сервопривод MG996R','MG996R','Запчасти','Оприходован','1 290 ₽','1 190 ₽','43']
];
const managers=[
  ['Макаров В.','makarov@4sales.ru','Менеджер продаж','Занят','152','18 100 ₽','2 842 400 ₽'],
  ['Марина Ф.','marina@4sales.ru','Аккаунт-менеджер','Свободен','128','15 620 ₽','1 999 360 ₽'],
  ['Алексей М.','alexey@4sales.ru','Менеджер продаж','Занят','104','11 700 ₽','1 216 800 ₽'],
  ['Игорь Л.','igor@4sales.ru','Руководитель отдела','Свободен','86','21 400 ₽','1 840 400 ₽']
];

const titles={orders:'Заказы',clients:'Все клиенты',communications:'Коммуникации',products:'Товары и склады',managers:'Менеджеры','new-order':'Новый заказ'};
const implemented=new Set(['orders','clients','communications','products','managers','new-order']);
let root,title,headerActions,dashboardActions,dashboard,syncLine,toast,dialog;

export function calculateOrderTotal(quantity=1,discount=0,delivery=0){
  const qty=Math.max(1,Math.min(12,Number(quantity)||1)),rate=Math.max(0,Math.min(100,Number(discount)||0)),shipping=Math.max(0,Number(delivery)||0),subtotal=12000*qty,discountValue=Math.round(subtotal*rate/100);
  return {quantity:qty,subtotal,discount:discountValue,delivery:shipping,total:subtotal-discountValue+shipping};
}

function status(value){
  const cls=/ошиб|отмен|возврат/i.test(value)?'danger':/ожида|новый|занят/i.test(value)?'warning':/актив|оплачен|отправ|приход|свободен|пути/i.test(value)?'success':'neutral';
  return `<span class="crm-status ${cls}">${escape(value)}</span>`;
}
function kpis(items){return `<section class="crm-kpis" aria-label="Сводка">${items.map(([label,value,note,tone='blue'])=>`<article class="crm-kpi ${tone}"><p>${label}</p><strong>${value}</strong><span>${note}</span></article>`).join('')}</section>`;}
function filters(fields){return `<form class="crm-filters" data-filter-form><div class="crm-panel-heading"><div><span class="eyebrow">Рабочая область</span><h2>Фильтры</h2></div><button class="filter-collapse" type="button" data-collapse-filter aria-expanded="true">Свернуть</button></div><div class="filter-grid">${fields.map(([label,type='select',options='Все'])=>`<label><span>${label}</span>${type==='text'?`<input type="search" data-search placeholder="${options}">`:`<select>${options.split('|').map(o=>`<option>${o}</option>`).join('')}</select>`}</label>`).join('')}</div><div class="filter-actions"><button class="button button-primary" type="submit">Применить</button><button class="button button-ghost" type="reset">Сбросить</button><button class="more-filter" type="button" data-demo-action="Дополнительные фильтры">Больше фильтров</button></div></form>`;}
function table(headers,rows,{kind='generic',caption='Список'}={}){
  return `<section class="crm-table-card"><div class="crm-panel-heading table-heading"><div><span class="eyebrow">${rows.length} записей на странице</span><h2>${caption}</h2></div><div class="selection-tools"><span data-selected-count>Ничего не выбрано</span><button class="button button-secondary button-small" type="button" data-demo-action="Массовые действия">Действия</button></div></div><div class="crm-table-scroll"><table class="crm-table" data-table="${kind}"><thead><tr><th><input type="checkbox" data-select-all aria-label="Выбрать все"></th>${headers.map(h=>`<th>${h}</th>`).join('')}<th><span class="sr-only">Действия</span></th></tr></thead><tbody>${rows.map((row,i)=>`<tr data-search-row><td><input type="checkbox" data-row-check aria-label="Выбрать строку ${i+1}"></td>${row.map((cell,j)=>`<td>${j===0&&kind==='orders'?`<button class="table-link" type="button" data-view="new-order">#${escape(cell)}</button>`:j===1&&['orders'].includes(kind)?escape(cell):(['orders','clients','communications','products','managers'].includes(kind)&&((kind==='orders'&&[5,6].includes(j))||(kind==='clients'&&j===1)||(kind==='communications'&&j===4)||(kind==='products'&&j===3)||(kind==='managers'&&j===3)))?status(cell):escape(cell)}</td>`).join('')}<td><button class="row-more" type="button" aria-label="Действия со строкой" data-demo-action="Карточка записи">•••</button></td></tr>`).join('')}</tbody></table></div><div class="table-footer"><button class="button button-secondary button-small" type="button" data-export-table>Выгрузить таблицу</button><div class="pagination"><span>${rows.length} / стр.</span><button type="button" disabled aria-label="Назад">‹</button><strong>1</strong><button type="button" aria-label="Вперёд" data-demo-action="Следующая страница">›</button><span>1 из 56</span></div></div><div class="empty-results" data-empty-results hidden><strong>Ничего не найдено</strong><p>Измените запрос или сбросьте фильтры.</p></div></section>`;
}
function ordersPage(){return `<div class="crm-page-enter">${kpis([['В работе','12','+9% к прошлому месяцу'],['Заказов за месяц','342','+10% к маю 2025','green'],['Требуют подтверждения','2','Проверьте данные','orange']])}${filters([['Менеджер','select','Все менеджеры|Сангинов Марк|Макаров В.'],['Товар/услуга','select','Выберите значение|Радиоуправляемая машина'],['Дата оформления','select','Последние 7 дней|Сегодня|Этот месяц'],['Тип доставки','select','Любой тип доставки|Курьер|Самовывоз'],['Номер заказа','text','Впишите номер заказа']])}${table(['Заказ','Создан','Менеджер','Покупатель','Сумма','Статус','Оплата'],orders,{kind:'orders',caption:'Список заказов'})}</div>`;}
function clientsPage(){return `<div class="crm-page-enter">${kpis([['Всего клиентов','128','+10% в этом месяце'],['Активных','64','50% клиентской базы','green'],['Новых за неделю','18','−4% к прошлой неделе','orange']])}${filters([['Менеджер','select','Все менеджеры|Сангинов Марк|Макаров В.'],['Сегмент','select','Все сегменты|Постоянные|Новые'],['Статус клиента','select','Все статусы|Активен|Не активен'],['Дата регистрации','select','21 / 08 / 2026|Этот месяц'],['Имя или телефон/почта','text','Найти клиента']])}${table(['Клиент','Статус','Телефон','Почта','Заказов','Сумма заказов','Последняя активность'],clients,{kind:'clients',caption:'Список клиентов'})}</div>`;}
function communicationsPage(mode='emails'){
  const isSms=mode==='sms',rows=isSms?sms:emails;
  return `<div class="crm-page-enter"><div class="comm-tabs" role="tablist" aria-label="Тип коммуникаций"><button type="button" role="tab" data-comm-tab="emails" aria-selected="${!isSms}">Письма</button><button type="button" role="tab" data-comm-tab="sms" aria-selected="${isSms}">СМС</button></div>${kpis([['Всего сообщений','1 240','+10% в этом месяце'],['Ожидают отправки','74','В очереди','orange'],['Доставлено сегодня','912','94% доставляемости','green']])}${filters([['Отправители','select','Все|4sales|Сангинов Марк'],['Дата','select','21 / 08 / 2026|Сегодня|Неделя'],['Заказ','text','Впишите номер заказа'],['Клиент','text','ФИО или телефон'],['Получатель','text','Кому']])}${table(['Получатель','Тема','Менеджер','Канал','Статус','Создано'],rows,{kind:'communications',caption:isSms?'Список СМС':'Список писем'})}</div>`;
}
function productsPage(){return `<div class="crm-page-enter"><nav class="inventory-tabs" aria-label="Товары и склады"><button aria-current="page">Просмотр товаров</button><button data-demo-action="Группы товаров">Группы</button><button data-demo-action="Бренды">Бренды</button><button data-demo-action="Склады">Склады</button><button data-demo-action="Оприходования">Оприходования</button></nav>${filters([['Артикул','text','Введите значение'],['Бренды','select','Все бренды|WPL|Double Eagle|Syma'],['Оприходование товаров','select','Выберите значение|Оприходован|Ожидает'],['Склады','select','Все склады|Основной|Резервный'],['Группы товаров','select','Все группы|Техника|Аксессуары']])}${table(['Наименование товара','Артикул','Категория','Статус','Цена','Цена со скидкой','Остаток'],products,{kind:'products',caption:'Просмотр товаров'})}</div>`;}
function managersPage(){return `<div class="crm-page-enter">${kpis([['Команда продаж','8','6 в сети сейчас'],['Заказов в работе','470','По всей команде','blue'],['Продажи за месяц','7 898 960 ₽','+12% к апрелю','green']])}${filters([['Email','text','manager@4sales.ru'],['Комментарий','text','Поиск по комментариям'],['Менеджер','select','Все менеджеры|Макаров В.|Марина Ф.'],['Должность','select','Все должности|Менеджер продаж|Аккаунт-менеджер'],['Статус','select','Все статусы|Занят|Свободен']])}${table(['Менеджер','Email','Должность','Статус','Заказов','Средний чек','Сумма продаж'],managers,{kind:'managers',caption:'Список менеджеров'})}</div>`;}
function field(label,control){return `<label class="form-field"><span>${label}</span>${control}</label>`;}
function newOrderPage(){return `<form class="order-layout crm-page-enter" id="new-order-form"><div class="order-main">
  <section class="form-section"><div class="section-title"><span>01</span><div><h2>Основное</h2><p>Источник и ответственный за заказ</p></div></div><div class="form-grid">${field('Страна','<select><option>Россия</option><option>Таджикистан</option></select>')}${field('Способ обращения','<select><option>Не выбрано</option><option>Сайт</option><option>Чат</option></select>')}${field('Тип заказа','<select><option>Основной</option><option>Предзаказ</option></select>')}${field('Магазин','<select><option>Выберите магазин</option><option>Интернет-магазин</option></select>')}${field('Менеджер','<select><option>Сангинов Марк</option><option>Макаров В.</option></select>')}</div></section>
  <section class="form-section"><div class="section-title"><span>02</span><div><h2>Покупатель</h2><p>Найдите клиента или заполните данные</p></div></div><div class="customer-search"><input type="search" placeholder="Телефон, email или ФИО"><button class="button button-secondary" type="button" data-demo-action="Поиск клиента">Найти</button></div><div class="form-grid">${field('Имя','<input required value="Анна" placeholder="Впишите имя покупателя">')}${field('Фамилия','<input required value="Котова" placeholder="Впишите фамилию покупателя">')}${field('Телефон','<input required value="+7 916 224-70-18">')}${field('Email','<input type="email" value="anna.kotova@mail.ru">')}${field('Отчество','<input placeholder="Впишите отчество покупателя">')}</div></section>
  <section class="form-section"><div class="section-title"><span>03</span><div><h2>Параметры заказа</h2><p>Статус и внутренняя информация</p></div></div><div class="form-grid">${field('Дата создания','<input type="date" value="2026-05-21">')}${field('Статус','<select><option>Новый</option><option>В работе</option></select>')}${field('Ссылка с сайта','<input type="url" placeholder="https://">')}</div>${field('Комментарий к заказу','<textarea maxlength="250" placeholder="Дополнительная информация по заказу"></textarea>')}</section>
  <section class="form-section"><div class="section-title"><span>04</span><div><h2>Состав заказа</h2><p>Товары, количество и скидка</p></div></div><div class="order-item"><div class="product-thumb">RC</div><div><strong>Double Eagle JEEP Wrangler Rubicon 1:9</strong><span>Артикул: CW2288-111 · на складе: 12 шт.</span></div><label><span>Количество</span><input id="order-quantity" type="number" min="1" max="12" value="2"></label><strong data-item-total>24 000 ₽</strong><button type="button" aria-label="Удалить товар" data-demo-action="Удаление позиции">×</button></div><button class="add-product" type="button" data-demo-action="Добавление товара">+ Добавить товар</button><div class="form-grid compact">${field('Разовая скидка','<input id="order-discount" type="number" min="0" max="100" value="10"><span class="field-suffix">%</span>')}${field('Стоимость доставки','<input id="order-delivery" type="number" min="0" value="300">')}</div><dl class="order-calculation"><div><dt>Стоимость товаров</dt><dd data-products-total>24 000 ₽</dd></div><div><dt>Сумма скидки</dt><dd data-discount-total>2 400 ₽</dd></div><div><dt>Стоимость доставки</dt><dd data-delivery-total>300 ₽</dd></div><div class="total"><dt>Осталось оплатить</dt><dd data-order-total>21 900 ₽</dd></div></dl></section>
  <section class="form-section"><div class="section-title"><span>05</span><div><h2>Способ получения</h2><p>Доставка и адрес покупателя</p></div></div><div class="delivery-options"><label><input type="radio" name="delivery" checked><span>Курьер</span></label><label><input type="radio" name="delivery"><span>Самовывоз</span></label><label><input type="radio" name="delivery"><span>Транспортная компания</span></label></div><div class="form-grid">${field('Почтовый индекс','<input value="101000">')}${field('Регион','<input value="Московская область">')}${field('Город','<input value="Москва">')}${field('Адрес','<input value="ул. Тверская, д. 18, кв. 45">')}${field('Дата доставки','<input type="date" value="2026-05-23">')}${field('Время доставки','<select><option>14:00–16:00</option><option>16:00–18:00</option></select>')}</div>${field('Комментарий курьеру','<textarea maxlength="250" placeholder="Комментарий"></textarea>')}</section>
  <section class="form-section"><div class="section-title"><span>06</span><div><h2>Способ оплаты</h2><p>Платёж и его статус</p></div></div><div class="form-grid">${field('Способ оплаты','<select><option>Не выбрано</option><option>Банковская карта</option><option>Наличные</option></select>')}${field('Статус','<select><option>Ожидает</option><option>Оплачен</option></select>')}${field('Дата оплаты','<input type="date" value="2026-05-21">')}${field('Сумма','<input type="number" min="0" value="0">')}</div><button class="button button-secondary" type="button" data-demo-action="Добавление способа оплаты">Добавить способ оплаты</button></section>
  <section class="form-section"><div class="section-title"><span>07</span><div><h2>Отгрузка</h2><p>Склад и передача в доставку</p></div></div><div class="form-grid">${field('Склад отгрузки','<select><option>Основной склад</option><option>Резервный склад</option></select>')}${field('Дата отгрузки','<input type="date" value="2026-05-22">')}${field('Статус отгрузки','<select><option>Не отгружен</option><option>Готов к отгрузке</option></select>')}</div><label class="check-row"><input type="checkbox"> Указать габариты посылки</label><button class="button button-secondary" type="button" data-demo-action="Передача в СДЭК">Отправить в СДЭК</button></section>
  </div><aside class="order-aside"><section class="order-summary"><span class="eyebrow">Заказ</span><h2>№ 567823</h2><dl><div><dt>Заказ ведёт</dt><dd>Сангинов Марк</dd></div><div><dt>Статус</dt><dd>${status('Новый')}</dd></div><div><dt>Документы</dt><dd>Не прикреплены</dd></div></dl><button class="button button-secondary" type="button" data-demo-action="Добавление файла">Добавить файл</button>${field('Комментарий оператора','<textarea maxlength="250" placeholder="Комментарий к заказу"></textarea>')}<div class="aside-total"><span>Всего к оплате</span><strong data-aside-total>21 900 ₽</strong></div><button class="button button-primary save-order" type="submit">Сохранить заказ</button></section></aside></form>`;}

function pageTemplate(key){return ({orders:ordersPage,clients:clientsPage,communications:communicationsPage,products:productsPage,managers:managersPage,'new-order':newOrderPage}[key]||ordersPage)();}
function actionsFor(key){
  const map={orders:['Импорт заказов','Новый заказ'],clients:['Импорт клиентов','Новый клиент'],communications:['','Новое письмо'],products:['Импорт товаров','Новый товар'],managers:['Импорт менеджеров','Новый менеджер'],'new-order':['','Закрыть']};
  const [secondary,primary]=map[key]||['',''];
  return `<button class="icon-button notification-button" type="button" data-panel="notifications" aria-label="Уведомления"><img src="assets/figma/icon-bell.svg" alt=""></button>${secondary?`<button class="button button-secondary" type="button" data-demo-action="${secondary}">${secondary}</button>`:''}<button class="button button-primary" type="button" ${key==='orders'?'data-view="new-order"':key==='new-order'?'data-view="orders"':`data-demo-action="${primary}"`}>${primary}</button>`;
}
function syncNavigation(key){
  for(const el of document.querySelectorAll('.nav-row,.nav-subrow')){el.classList.remove('current');el.removeAttribute('aria-current');}
  const target=key==='dashboard'?document.querySelector('[data-view="dashboard"]'):document.querySelector(`[data-module="${key==='new-order'?'orders':key}"]`);
  if(target){target.classList.add('current');target.setAttribute('aria-current','page');}
  if(key!=='dashboard'){
    const sales=document.querySelector('[data-group="sales"]');if(sales?.getAttribute('aria-expanded')==='false')sales.click();
    if(key==='products'){const inventory=document.querySelector('[data-group="inventory"]');if(inventory?.getAttribute('aria-expanded')==='false')inventory.click();}
  }
}
function updateHeader(key){
  const isDashboard=key==='dashboard';title.textContent=isDashboard?'Дашборд':titles[key];dashboardActions.hidden=!isDashboard;headerActions.hidden=isDashboard;
  if(!isDashboard)headerActions.innerHTML=actionsFor(key);
  syncLine.querySelector('p').innerHTML=isDashboard?'Последняя синхронизация: <strong>21 мая 2026 20:42</strong>':'Последняя синхронизация: <strong>21 мая 2026, 10:42</strong>';
  document.title=(isDashboard?'Дашборд':titles[key])+' — 4sales CRM';
}
export function isWorkspacePage(key){return implemented.has(key);}
export function showWorkspacePage(key,{focus=true,history=true}={}){
  if(key==='dashboard'){
    root.hidden=true;dashboard.hidden=false;updateHeader('dashboard');syncNavigation('dashboard');
  }else if(implemented.has(key)){
    dashboard.hidden=true;root.hidden=false;root.innerHTML=pageTemplate(key);root.dataset.page=key;updateHeader(key);syncNavigation(key);wirePage(key);
  }else return false;
  if(history&&location.hash!=='#'+key)historyAPI(key);
  if(focus)(key==='dashboard'?dashboard:root).focus({preventScroll:true});
  return true;
}
function historyAPI(key){window.history.pushState({page:key},'',key==='dashboard'?'#dashboard':'#'+key);}
function updateSelection(){const checks=[...root.querySelectorAll('[data-row-check]')],count=checks.filter(c=>c.checked).length,output=root.querySelector('[data-selected-count]');if(output)output.textContent=count?`Выбрано: ${count}`:'Ничего не выбрано';const all=root.querySelector('[data-select-all]');if(all){all.checked=count===checks.length&&count>0;all.indeterminate=count>0&&count<checks.length;}}
function applySearch(value){const query=value.trim().toLocaleLowerCase('ru');let visible=0;for(const row of root.querySelectorAll('[data-search-row]')){row.hidden=query&&!row.textContent.toLocaleLowerCase('ru').includes(query);if(!row.hidden)visible++;}const empty=root.querySelector('[data-empty-results]');if(empty)empty.hidden=visible>0;const wrap=root.querySelector('.crm-table-scroll');if(wrap)wrap.hidden=visible===0;}
function exportTable(){const rows=[...root.querySelectorAll('.crm-table tr')].filter(r=>!r.hidden).map(r=>[...r.cells].slice(1,-1).map(c=>'"'+c.textContent.trim().replaceAll('"','""')+'"').join(';'));const blob=new Blob(['\uFEFF'+rows.join('\r\n')+'\r\n'],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=(root.dataset.page||'4sales')+'-export.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Таблица выгружена в CSV');}
function wirePage(key){
  root.querySelector('[data-filter-form]')?.addEventListener('submit',e=>{e.preventDefault();applySearch([...root.querySelectorAll('[data-search]')].map(input=>input.value).filter(Boolean).join(' '));toast('Фильтры применены');});
  root.querySelector('[data-filter-form]')?.addEventListener('reset',()=>{setTimeout(()=>applySearch(''),0);toast('Фильтры сброшены');});
  for(const input of root.querySelectorAll('[data-search]'))input.addEventListener('input',e=>applySearch(e.target.value));
  root.querySelector('[data-select-all]')?.addEventListener('change',e=>{for(const c of root.querySelectorAll('[data-row-check]'))if(!c.closest('tr').hidden)c.checked=e.target.checked;updateSelection();});
  root.onchange=e=>{if(e.target.matches('[data-row-check]'))updateSelection();};
  root.querySelector('[data-export-table]')?.addEventListener('click',exportTable);
  root.querySelector('[data-collapse-filter]')?.addEventListener('click',e=>{const form=e.currentTarget.closest('.crm-filters'),grid=form.querySelector('.filter-grid'),actions=form.querySelector('.filter-actions'),open=e.currentTarget.getAttribute('aria-expanded')==='true';grid.hidden=open;actions.hidden=open;e.currentTarget.setAttribute('aria-expanded',String(!open));e.currentTarget.textContent=open?'Развернуть':'Свернуть';});
  if(key==='new-order')wireOrder();
}
function wireOrder(){
  const form=root.querySelector('#new-order-form'),quantity=root.querySelector('#order-quantity'),discount=root.querySelector('#order-discount'),delivery=root.querySelector('#order-delivery');
  const render=()=>{const value=calculateOrderTotal(quantity.value,discount.value,delivery.value);root.querySelector('[data-item-total]').textContent=money.format(value.subtotal);root.querySelector('[data-products-total]').textContent=money.format(value.subtotal);root.querySelector('[data-discount-total]').textContent=money.format(value.discount);root.querySelector('[data-delivery-total]').textContent=money.format(value.delivery);root.querySelector('[data-order-total]').textContent=money.format(value.total);root.querySelector('[data-aside-total]').textContent=money.format(value.total);};
  for(const input of [quantity,discount,delivery])input.addEventListener('input',render);
  form.addEventListener('submit',e=>{e.preventDefault();toast('Заказ № 567823 сохранён');setTimeout(()=>showWorkspacePage('orders'),450);});render();
}
export function initWorkspacePages({showToast,openDialog}){
  root=document.querySelector('#workspace-page');title=document.querySelector('#page-title');headerActions=document.querySelector('#module-header-actions');dashboardActions=document.querySelector('.dashboard-header-actions');dashboard=document.querySelector('#main-content');syncLine=document.querySelector('.sync-line');toast=showToast;dialog=openDialog;
  document.addEventListener('click',event=>{
    const view=event.target.closest('[data-view]');if(view){event.preventDefault();event.stopImmediatePropagation();showWorkspacePage(view.dataset.view);return;}
    const module=event.target.closest('[data-module]');if(module&&implemented.has(module.dataset.module)){event.preventDefault();event.stopImmediatePropagation();document.querySelector('#app-dialog')?.close();showWorkspacePage(module.dataset.module);return;}
    const tab=event.target.closest('[data-comm-tab]');if(tab){root.innerHTML=communicationsPage(tab.dataset.commTab);headerActions.querySelector('.button-primary').textContent=tab.dataset.commTab==='sms'?'Новое СМС':'Новое письмо';wirePage('communications');return;}
    const demo=event.target.closest('[data-demo-action]');if(demo){const action=demo.dataset.demoAction;dialog(action,`<span class="demo-tag">Демонстрационный режим</span><p>Действие «${escape(action)}» показано как честное состояние прототипа. Внешние сервисы и реальные данные не подключены.</p><button class="button button-primary" type="button" data-close-dialog>Понятно</button>`);}
  });
  window.addEventListener('popstate',()=>showWorkspacePage(location.hash.slice(1)||'dashboard',{history:false}));
  const initial=location.hash.slice(1);if(initial&&implemented.has(initial))showWorkspacePage(initial,{focus:false,history:false});
}
