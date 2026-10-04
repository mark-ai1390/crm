import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {CHANNELS,DAILY_REVENUE,HOURLY_REVENUE,MANAGERS,UNASSIGNED_REVENUE,MONTH_REVENUE,DAY_REVENUE,ORDER_MONTHS,allocateTotal,percentageShares,getChannels,getSummary,getRevenuePeriod,getOrderMonth,getOrderTrend,createSummaryCsv,sum} from '../public/assets/js/dashboard-data.js';
import {readSidebarState,saveSidebarState,changeBranch} from '../public/assets/js/sidebar.js';

test('KPI, каналы, дни месяца и часы используют согласованные суммы',()=>{
  assert.equal(MONTH_REVENUE,1248900);
  assert.equal(DAY_REVENUE,115605);
  assert.equal(sum(DAILY_REVENUE.map(r=>r.value)),MONTH_REVENUE);
  assert.equal(DAILY_REVENUE.at(-1).value,DAY_REVENUE);
  assert.equal(sum(HOURLY_REVENUE.map(r=>r.value)),DAY_REVENUE);
  assert.equal(sum(MANAGERS.map(m=>m.sales))+UNASSIGNED_REVENUE,DAY_REVENUE);
  assert.equal(getSummary().orderCount,342);
  assert.equal(getSummary().dayChange,-10);
});
test('Средний чек и конверсия вычислены для каждого канала',()=>{
  assert.deepEqual(getChannels().map(c=>c.average),[3826,3946,3040,3414]);
  assert.deepEqual(getChannels().map(c=>c.conversion),[5.4,3.7,2.9,2.1]);
});
test('Округление долей сохраняет все 100 процентов',()=>{
  assert.deepEqual(percentageShares([1,1,1]),[34,33,33]);
  assert.deepEqual(allocateTotal(13,[2,3,4]),[3,4,6]);
  assert.throws(()=>percentageShares([0,0]),RangeError);
  assert.throws(()=>allocateTotal(10,[-1,2]),RangeError);
});
test('Выбранный месяц связан с количеством заказов и донатом',()=>{
  for(let i=0;i<ORDER_MONTHS.length;i++){const m=getOrderMonth(i);assert.equal(sum(m.channels),m.count);assert.equal(sum(m.shares),100);}
  assert.deepEqual(getOrderMonth(2).shares,[42,31,18,9]);
  assert.equal(getOrderMonth(2).change,10);
  assert.deepEqual(getOrderMonth(4).channels,CHANNELS.map(c=>c.orders));
  assert.throws(()=>getOrderMonth(6),RangeError);
});
test('Прогноз отделён от наблюдаемых значений',()=>{
  const m=getOrderTrend(2);
  assert.equal(m.date,'31 марта');
  assert.deepEqual(m.points.map(p=>p.forecast),[false,false,false,true,true]);
  assert.equal(m.points[2].value,128);
});
test('Неделя, месяц и произвольный период меняют фактические записи',()=>{
  const week=getRevenuePeriod('week');
  assert.equal(week.records.length,7);
  assert.equal(week.records[0].date,'2026-05-15');
  assert.equal(week.records.at(-1).date,'2026-05-21');
  assert(week.total<getRevenuePeriod('month').total);
  assert.equal(getRevenuePeriod('custom',{from:'2026-05-01',to:'2026-05-21'}).total,MONTH_REVENUE);
  assert.equal(getRevenuePeriod('custom',{from:'2026-05-21',to:'2026-05-21'}).total,DAY_REVENUE);
});
test('Ошибочные даты не дают пустую или неверную сводку',()=>{
  for(const range of [{from:'2026-05-22',to:'2026-05-22'},{from:'2026-05-20',to:'2026-05-02'},{from:'2026-04-30',to:'2026-05-02'},{from:'',to:''}])assert.throws(()=>getRevenuePeriod('custom',range),RangeError);
  assert.throws(()=>getRevenuePeriod('other'),RangeError);
});
test('CSV содержит реальные числовые значения и выбранный период',()=>{
  const csv=createSummaryCsv('custom',{from:'2026-05-21',to:'2026-05-21'},4);
  assert(csv.startsWith('\uFEFF'));
  assert(csv.includes('"Сайт";"520400";"136";"3826";"5.4";"Активен"'));
  assert(csv.includes('"Итого";"1248900";"342"'));
  assert(csv.includes('"Выручка";"21 мая 2026"'));
  assert(csv.includes('"Итого";"115605"'));
  assert(csv.includes('"Заказы по каналам";"Май 2026"'));
  assert(csv.endsWith('\r\n'));
});
test('Второй уровень раскрывает родителя и сохраняет отдельное состояние',()=>{
  let state={compact:false,salesOpen:false,inventoryOpen:false};
  state=changeBranch(state,'inventory',true);
  assert(state.salesOpen&&state.inventoryOpen);
  state=changeBranch(state,'sales',false);
  assert(!state.salesOpen&&state.inventoryOpen);
  state=changeBranch(state,'sales',true);
  assert(state.inventoryOpen);
  assert.throws(()=>changeBranch(state,'unknown'),RangeError);
});
test('Навигация восстанавливает только допустимые данные сессии',()=>{
  const memory=new Map(),storage={getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)};
  saveSidebarState(storage,{compact:true,salesOpen:true,inventoryOpen:false,token:'not-persisted'});
  assert.deepEqual(readSidebarState(storage),{compact:true,salesOpen:true,inventoryOpen:false});
  assert(![...memory.values()][0].includes('token'));
  assert.deepEqual(readSidebarState({getItem:()=>'{broken'}),{compact:false,salesOpen:false,inventoryOpen:false});
  assert.doesNotThrow(()=>saveSidebarState({setItem:()=>{throw Error('Unavailable');}},{}));
});
test('Разметка содержит доступные связи контролов без повторённых id',async()=>{
  const html=await readFile(new URL('../public/index.html',import.meta.url),'utf8');
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length);
  for(const m of html.matchAll(/\b(?:aria-controls|aria-labelledby)="([^"]+)"/g))for(const id of m[1].split(' '))assert(ids.includes(id),id);
  assert(html.includes('id="sales-submenu" hidden'));
  assert(html.includes('id="inventory-submenu" hidden'));
  assert(html.includes('<dialog'));
  assert(html.includes('Демо-данные'));
});
