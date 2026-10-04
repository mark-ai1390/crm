import {CHANNELS,MANAGERS,SNAPSHOT,formatMoney,formatNumber,formatChange,getSummary,getChannels,getRevenuePeriod,getOrderMonth,getOrderTrend,createSummaryCsv,sum} from './dashboard-data.js';
import {initSidebar} from './sidebar.js';

const $=selector=>document.querySelector(selector);
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const state={period:'today',range:{from:'2026-05-01',to:'2026-05-21'},month:2,selectedBar:8};
const sidebar=initSidebar();
const dialog=$('#app-dialog'),dialogBody=$('#dialog-body');
let dialogOpener=null,toastTimer;

function showToast(text){const el=$('#toast');clearTimeout(toastTimer);el.textContent=text;el.hidden=false;toastTimer=setTimeout(()=>{el.hidden=true;},3800);}
function openDialog(title,html,{drawer=false}={}){
  if(!dialog.open)dialogOpener=document.activeElement;
  sidebar.closeMobile(false);
  $('#dialog-title').textContent=title;dialogBody.innerHTML=html;dialog.classList.toggle('drawer',drawer);
  if(!dialog.open)dialog.showModal();dialog.querySelector('.dialog-close').focus();
}
$('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>sidebar.restoreFocus(dialogOpener));
dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
dialogBody.addEventListener('click',event=>{if(event.target.closest('[data-close-dialog]'))dialog.close();});

function renderSummary(){
  const s=getSummary();
  $('#work-value').textContent=s.work;$('#month-value').textContent=formatMoney(s.monthRevenue);$('#day-value').textContent=formatMoney(s.dayRevenue);
  for(const key of ['work','month','day'])$('#'+key+'-change').textContent=formatChange(s[key+'Change']);
  $('#channel-summary').textContent='4 канала / '+s.orderCount+' заказа';
  $('#channel-rows').innerHTML=getChannels().map(c=>'<tr><th scope="row">'+escape(c.name)+'</th><td>'+escape(formatMoney(c.revenue))+'</td><td>'+c.orders+'</td><td>'+escape(formatMoney(c.average))+'</td><td>'+c.conversion.toFixed(1)+'%</td><td><span class="status-tag '+(c.active?'':'inactive')+'">'+(c.active?'Активен':'Не активен')+'</span></td></tr>').join('');
}

function renderBarChart(){
  const period=getRevenuePeriod(state.period,state.range),max=Math.max(...period.records.map(r=>r.value)),grid=$('#revenue-bars');
  state.selectedBar=Math.min(period.selected,period.records.length-1);
  grid.classList.toggle('dynamic',state.period!=='today');
  grid.innerHTML=period.records.map((r,i)=>'<button class="bar-button" type="button" data-index="'+i+'" data-selected="'+(i===state.selectedBar)+'" tabindex="'+(i===state.selectedBar?'0':'-1')+'" aria-label="'+escape(r.label+(state.period==='today'?'':' мая')+': '+formatMoney(r.value))+'"><span class="bar-image">'+(state.period==='today'?'<img src="assets/figma/'+r.asset+'" alt="">':'<span class="data-bar" style="--bar-height:'+Math.max(8,Math.round(r.value/max*157))+'px"></span>')+'</span><span class="bar-label">'+r.label+'</span></button>').join('');
  const viewport=$('.bar-viewport');viewport.setAttribute('aria-label','Выручка: '+period.title+'. Стрелки переключают значения.');
  for(const button of document.querySelectorAll('[data-period]'))button.setAttribute('aria-pressed',String(button.dataset.period===state.period));
  if(state.period!=='today')viewport.scrollLeft=0;
  selectBar(state.selectedBar);
}
function selectBar(index,{focus=false,temporary=false}={}){
  const report=getRevenuePeriod(state.period,state.range),buttons=[...document.querySelectorAll('.bar-button')],record=report.records[index];
  if(!record)return;
  if(!temporary)state.selectedBar=index;
  for(const button of buttons){const current=+button.dataset.index===index;button.dataset.selected=String(current);button.tabIndex=current?0:-1;button.querySelector('.bar-tooltip')?.remove();}
  const tooltip=document.createElement('span');tooltip.className='bar-tooltip';tooltip.textContent=formatMoney(record.value);tooltip.setAttribute('aria-hidden','true');buttons[index].querySelector('.bar-image').append(tooltip);
  $('#revenue-value').textContent=formatMoney(record.value);
  $('#revenue-description').textContent=report.title+'; '+record.label+': '+formatMoney(record.value)+'. Итого за период: '+formatMoney(report.total)+'.';
  if(focus)buttons[index].focus();
}
$('#revenue-bars').addEventListener('pointerover',event=>{const button=event.target.closest('.bar-button');if(button)selectBar(+button.dataset.index,{temporary:true});});
$('#revenue-bars').addEventListener('pointerleave',()=>selectBar(state.selectedBar));
$('#revenue-bars').addEventListener('click',event=>{const button=event.target.closest('.bar-button');if(button)selectBar(+button.dataset.index,{focus:true});});
$('#revenue-bars').addEventListener('focusin',event=>{const button=event.target.closest('.bar-button');if(button)selectBar(+button.dataset.index);});
$('#revenue-bars').addEventListener('keydown',event=>{
  const button=event.target.closest('.bar-button');if(!button)return;
  const index=+button.dataset.index,length=$('#revenue-bars').children.length;
  const next={ArrowLeft:Math.max(0,index-1),ArrowRight:Math.min(length-1,index+1),Home:0,End:length-1}[event.key];
  if(next!==undefined){event.preventDefault();selectBar(next,{focus:true});}
});
for(const button of document.querySelectorAll('[data-period]'))button.addEventListener('click',()=>{
  if(button.dataset.period==='custom')return openDateDialog();
  state.period=button.dataset.period;renderBarChart();
});
function openDateDialog(){
  openDialog('Выбрать период','<p>Демо-данные доступны с 1 по 21 мая 2026 года.</p><form id="date-range-form"><div class="date-fields"><label>Начало<input type="date" name="from" min="2026-05-01" max="2026-05-21" required value="'+state.range.from+'"></label><label>Конец<input type="date" name="to" min="2026-05-01" max="2026-05-21" required value="'+state.range.to+'"></label></div><p class="form-error" id="range-error" role="alert" hidden></p><button class="button button-primary" type="submit">Применить</button></form>');
  $('#date-range-form').addEventListener('submit',event=>{
    event.preventDefault();const form=new FormData(event.currentTarget),range={from:form.get('from'),to:form.get('to')};
    try{getRevenuePeriod('custom',range);state.range=range;state.period='custom';renderBarChart();dialog.close();}
    catch(error){$('#range-error').textContent=error.message;$('#range-error').hidden=false;}
  });
}

const colors=['#4d6ede','#879cec','#a4b4f2','#dce4fc'];
function curvedPath(points){return 'M'+points[0].x+','+points[0].y+points.slice(1).map((p,i)=>{const prev=points[i],mid=(prev.x+p.x)/2;return ' C'+mid+','+prev.y+' '+mid+','+p.y+' '+p.x+','+p.y;}).join('');}
function trendSvg(points){
  const max=Math.max(...points.map(p=>p.value))*1.15;
  const coords=points.map((p,i)=>({...p,x:[15,106,195,287,384][i],y:Math.round(250-p.value/max*200)}));
  const actual=curvedPath(coords.slice(0,3)),forecast=curvedPath(coords.slice(2)),current=coords[2];
  return '<svg width="400" height="259" viewBox="0 0 400 259" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="259" gradientUnits="userSpaceOnUse"><stop stop-color="#4d6ede" stop-opacity=".18"/><stop offset="1" stop-color="#4d6ede" stop-opacity="0"/></linearGradient></defs>'+[35,115,195,280,365].map(x=>'<path d="M'+x+' 33V250" stroke="#1c1c1e" stroke-opacity=".06" stroke-dasharray="4 4"/>').join('')+'<path d="'+actual+' L195 259L15 259Z" fill="url(#trend-fill)"/><path d="'+forecast+' L384 259L195 259Z" fill="url(#trend-fill)"/><path d="'+actual+'" stroke="#4d6ede" stroke-width="2"/><path d="'+forecast+'" stroke="#4d6ede" stroke-width="2" stroke-dasharray="4 4"/><circle cx="195" cy="'+current.y+'" r="9" fill="#4d6ede" fill-opacity=".16"/><circle cx="195" cy="'+current.y+'" r="5" fill="#4d6ede"/><path d="M195 '+(current.y-16)+'V'+(current.y-38)+'" stroke="#4d6ede" stroke-width="2"/><text x="195" y="'+(current.y-47)+'" text-anchor="middle" fill="#4d6ede" font-family="Inter, sans-serif" font-size="14" font-weight="700">'+current.value+'</text></svg>';
}
function renderOrders(){
  const month=getOrderMonth(state.month),trend=getOrderTrend(state.month);
  $('#orders-total-label').textContent='Всего за '+month.genitive+':';$('#orders-total').textContent=month.count+' шт';
  $('#orders-change').textContent=formatChange(month.change);$('#orders-change').classList.toggle('negative',month.change<0);$('#orders-change').title='По сравнению с '+month.genitive+' 2025';
  $('#forecast-note').innerHTML='Пунктир — прогноз<br><span>на '+escape(trend.date)+'</span>';
  $('#trend-description').textContent=trend.points.map(p=>p.label+': '+p.value+(p.forecast?' — прогноз':'')).join('; ')+'. Демонстрационный прогноз на '+trend.date+' 2026.';
  $('#trend-months').innerHTML=trend.points.map((p,i)=>'<span class="'+(i===2?'selected':'')+'">'+p.label+'</span>').join('');
  const reference=state.month===2;$('#trend-reference').hidden=!reference;$('#trend-dynamic').hidden=reference;
  if(!reference)$('#trend-dynamic').innerHTML=trendSvg(trend.points);
  $('#donut-month').textContent=month.name;$('#donut-reference').hidden=!reference;$('#donut-dynamic').hidden=reference;
  let offset=0;const stops=month.shares.map((p,i)=>{const from=offset;offset+=p;return colors[i]+' '+from+'% '+offset+'%';});
  $('#donut-dynamic').style.background='conic-gradient('+stops.join(',')+')';
  for(const span of document.querySelectorAll('[data-share]'))span.textContent=month.shares[+span.dataset.share]+'%';
  $('#orders-donut').setAttribute('aria-label',month.name+': '+month.count+' заказов. '+CHANNELS.map((c,i)=>c.legend+' — '+month.shares[i]+'% ('+month.channels[i]+')').join(', ')+'.');
}
$('#orders-month').addEventListener('change',event=>{state.month=Number(event.target.value);renderOrders();});
function resizeTrend(){const width=$('#trend-viewport').clientWidth;if(!width)return;const scale=Math.min(1,width/398.895);$('#trend-art').style.transform='scale('+scale+')';$('#trend-viewport').style.height=(288.277*scale)+'px';$('.monthly-orders').style.height=(92+288.277*scale)+'px';}
if('ResizeObserver' in window)new ResizeObserver(resizeTrend).observe($('#trend-viewport'));else window.addEventListener('resize',resizeTrend);

$('#export-summary').addEventListener('click',()=>{
  const blob=new Blob([createSummaryCsv(state.period,state.range,state.month)],{type:'text/csv;charset=utf-8;'}),url=URL.createObjectURL(blob),link=document.createElement('a');
  link.href=url;link.download='4sales-summary-'+SNAPSHOT.date+'.csv';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);showToast('Сводка экспортирована в CSV');
});
function storageGet(key){try{return localStorage.getItem(key);}catch{return null;}}
function storageSet(key,value){try{localStorage.setItem(key,value);}catch{/* Данные текущего просмотра остаются доступны. */}}
function openNotifications(){
  const read=storageGet('4sales:notifications-read')==='yes';
  openDialog('Уведомления','<span class="demo-tag">Снимок на 21 мая 2026</span><ul class="notification-list '+(read?'read':'')+'"><li><span class="notification-dot"></span><div><h3>Марк выполнил план продаж</h3><p>40 000 ₽ — 100% дневного плана.</p></div></li><li><span class="notification-dot"></span><div><h3>Канал «Чаты» неактивен</h3><p>В майской сводке сохранены 72 заказа этого канала.</p></div></li><li><span class="notification-dot"></span><div><h3>Сводка за май доступна</h3><p>Сохраните показатели и выбранный период в CSV.</p></div></li></ul><button class="button button-secondary" id="read-notifications" type="button" '+(read?'disabled':'')+'>'+(read?'Всё прочитано':'Отметить всё прочитанным')+'</button>',{drawer:true});
  $('#read-notifications').addEventListener('click',event=>{storageSet('4sales:notifications-read','yes');$('.notification-list').classList.add('read');event.currentTarget.textContent='Всё прочитано';event.currentTarget.disabled=true;});
}
function openInsights(){
  const top=[...getChannels()].sort((a,b)=>b.revenue-a.revenue)[0],share=Math.round(top.revenue/getSummary().monthRevenue*100);
  openDialog('Разбор показателей','<span class="demo-tag">Демонстрационный разбор</span><p>Сводка по тестовым данным CRM. Внешний AI не подключён.</p><article class="insight highlight"><h3>Сайт приносит '+share+'% выручки</h3><p>'+escape(formatMoney(top.revenue))+' и '+top.orders+' заказов за май. Это ведущий канал по объёму продаж.</p></article><article class="insight"><h3>Чаты требуют внимания</h3><p>Канал сейчас неактивен. В отчёте — 72 заказа и 218 900 ₽. Проверьте подключение перед новой кампанией.</p></article><article class="insight"><h3>Марк выполнил дневной план</h3><p>'+escape(formatMoney(MANAGERS[0].sales))+' — 100% плана. Лидер команды по показателям за 21 мая.</p></article>',{drawer:true});
}
function openProfile(){
  openDialog('Профиль','<div class="profile-card"><span class="avatar" data-initials="МС" role="img" aria-label="Марк Сангинов"><span class="presence"></span></span><div><strong>Марк Сангинов</strong><p>Владелец · 4sales</p></div></div><dl class="profile-details"><dt>Статус</dt><dd>В сети</dd><dt>Рабочее пространство</dt><dd>4sales CRM</dd><dt>Режим</dt><dd>Демонстрация</dd><dt>В работе</dt><dd>12 заказов</dd></dl><p style="margin-top:20px">Этот проект использует тестовые данные. Реальные аккаунты и платежи не подключены.</p>');
}
const modules={analytics:'Аналитика',orders:'Заказы',clients:'Клиенты',communications:'Коммуникации',products:'Товары',groups:'Группы товаров',brands:'Бренды',warehouses:'Склады','write-offs':'Списания',counterparties:'Контрагенты',receipts:'Оприходования',managers:'Менеджеры',chats:'Чаты',calendar:'Календарь',tasks:'Задачи',settings:'Настройки'};
function openModule(key){openDialog(modules[key]||'Раздел','<span class="demo-tag">Демоверсия</span><p>Этот раздел ещё не доступен в демонстрации. Сейчас можно изучить дашборд: выручку, каналы продаж и результаты команды.</p><button class="button button-primary" type="button" data-close-dialog>Вернуться к дашборду</button>');}
document.addEventListener('click',event=>{
  const moduleButton=event.target.closest('[data-module]');if(moduleButton){openModule(moduleButton.dataset.module);return;}
  const panelButton=event.target.closest('[data-panel]');if(panelButton){({notifications:openNotifications,insights:openInsights,profile:openProfile})[panelButton.dataset.panel]?.();return;}
  const shortcutButton=event.target.closest('[data-shortcuts]');if(!shortcutButton)return;
  if(shortcutButton.dataset.shortcuts==='settings')return openProfile();
  const keys=shortcutButton.dataset.shortcuts==='apps'?['chats','calendar','tasks']:['orders','clients','communications','products','managers'];
  openDialog(shortcutButton.dataset.shortcuts==='apps'?'Приложения':'Быстрый доступ','<p>Разделы рабочего пространства 4sales.</p><div class="shortcut-list">'+keys.map(key=>'<button type="button" data-module="'+key+'">'+modules[key]+'</button>').join('')+'</div>');
});

renderSummary();renderBarChart();renderOrders();resizeTrend();
