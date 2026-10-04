// Один воспроизводимый набор демонстрационных данных. Внешних интеграций нет.
export const SNAPSHOT = Object.freeze({date:'2026-05-21',month:'2026-05',year:2026});
const money = new Intl.NumberFormat('ru-RU', {style:'currency',currency:'RUB',maximumFractionDigits:0});
const integers = new Intl.NumberFormat('ru-RU', {maximumFractionDigits:0});
export const formatMoney = value => money.format(value);
export const formatNumber = value => integers.format(value);
export const percentChange = (value, previous) => previous > 0 ? Math.round((value / previous - 1) * 100) : null;
export const formatChange = value => value === null ? '—' : (value < 0 ? '−' : '+') + Math.abs(value) + '%';
export const sum = values => values.reduce((total,value) => total + value,0);

export function allocateTotal(total, weights) {
  if (!Number.isSafeInteger(total) || total < 0 || !weights.length || weights.some(w => !Number.isFinite(w) || w < 0) || sum(weights) === 0) throw new RangeError('Некорректное распределение');
  const raw = weights.map(w => total * w / sum(weights));
  const values = raw.map(Math.floor);
  const order = raw.map((v,i) => ({i,fraction:v-values[i]})).sort((a,b) => b.fraction-a.fraction || a.i-b.i);
  const remainder=total-sum(values);
  for (let i=0;i<remainder;i++) values[order[i].i]++;
  return values;
}
export const percentageShares = values => allocateTotal(100,values);

export const CHANNELS = Object.freeze([
  {name:'Сайт',legend:'Сайты',revenue:520400,orders:136,visits:2520,active:true},
  {name:'Маркетплейс',legend:'Маркетплейсы',revenue:386700,orders:98,visits:2650,active:true},
  {name:'Чаты',legend:'Чаты',revenue:218900,orders:72,visits:2480,active:false},
  {name:'Офлайн',legend:'Офлайн',revenue:122900,orders:36,visits:1714,active:true}
].map(Object.freeze));
export function getChannels() {return CHANNELS.map(c => ({...c,average:Math.round(c.revenue/c.orders),conversion:Number((c.orders/c.visits*100).toFixed(1))}));}

// Высоты первого графика соответствуют исходным SVG. Значения и итог согласованы.
export const HOURLY_REVENUE = Object.freeze([
  {label:'09:00',value:10446,asset:'shape.svg',height:126},
  {label:'10:00',value:6500,asset:'shape1.svg',height:78.4},
  {label:'11:00',value:12071,asset:'shape2.svg',height:145.6},
  {label:'12:00',value:10446,asset:'shape.svg',height:126},
  {label:'13:00',value:9750,asset:'shape3.svg',height:117.6},
  {label:'14:00',value:7196,asset:'shape4.svg',height:86.8},
  {label:'15:00',value:11375,asset:'shape5.svg',height:137.2},
  {label:'16:00',value:6500,asset:'shape1.svg',height:78.4},
  {label:'17:00',value:13000,asset:'shape6.svg',height:156.8},
  {label:'18:00',value:8821,asset:'shape7.svg',height:106.4},
  {label:'19:00',value:13000,asset:'shape8.svg',height:156.8},
  {label:'20:00',value:6500,asset:'shape9.svg',height:78.4}
].map(Object.freeze));
export const MONTH_REVENUE = sum(CHANNELS.map(c=>c.revenue));
export const DAY_REVENUE = sum(HOURLY_REVENUE.map(c=>c.value));
export const PREVIOUS_DAY_REVENUE = 128450;
const earlierDays = allocateTotal(MONTH_REVENUE-DAY_REVENUE-PREVIOUS_DAY_REVENUE,[23,19,20,18,25,16,16,26,19,19,18,21,20,17,23,25,23,26,23]);
export const DAILY_REVENUE = Object.freeze([...earlierDays,PREVIOUS_DAY_REVENUE,DAY_REVENUE].map((value,i)=>Object.freeze({date:'2026-05-'+String(i+1).padStart(2,'0'),label:String(i+1).padStart(2,'0'),value})));

export const MANAGERS = Object.freeze([
  {name:'Марк',sales:40000,goal:40000},
  {name:'Иван',sales:15628,goal:40000},
  {name:'Григорий',sales:23169,goal:40000},
  {name:'Александр',sales:30744,goal:40000}
].map(Object.freeze));
export const UNASSIGNED_REVENUE = DAY_REVENUE-sum(MANAGERS.map(m=>m.sales));

export const ORDER_MONTHS = Object.freeze([
  {name:'Январь',genitive:'январь',date:'31 января',short:'Янв',count:180,previousYear:164,channels:[76,56,32,16]},
  {name:'Февраль',genitive:'февраль',date:'28 февраля',short:'Фев',count:141,previousYear:129,channels:[59,44,25,13]},
  {name:'Март',genitive:'март',date:'31 марта',short:'Мар',count:128,previousYear:116,channels:[54,40,23,11]},
  {name:'Апрель',genitive:'апрель',date:'30 апреля',short:'Апр',count:204,previousYear:186,channels:[86,63,37,18]},
  {name:'Май',genitive:'май',date:'21 мая',short:'Май',count:342,previousYear:311,channels:CHANNELS.map(c=>c.orders)}
].map(m=>Object.freeze({...m,channels:Object.freeze(m.channels)})));
export function getOrderMonth(index) {
  const m=ORDER_MONTHS[index];
  if(!m)throw new RangeError('Неизвестный месяц');
  return {...m,shares:percentageShares(m.channels),change:percentChange(m.count,m.previousYear)};
}
export function getOrderTrend(index) {
  const selected=getOrderMonth(index);
  const actual=[{short:'Ноя',count:167},{short:'Дек',count:191},...ORDER_MONTHS];
  const predictions=[[170,198],[180,203],[246,156],[260,225],[352,374]][index];
  const shorts=['Янв','Фев','Мар','Апр','Май','Июн','Июл'];
  return {date:selected.date,points:[...actual.slice(index,index+3).map(m=>({label:m.short,value:m.count,forecast:false})),...predictions.map((value,i)=>({label:shorts[index+i+1],value,forecast:true}))]};
}

export function getRevenuePeriod(period, range={}) {
  if(period==='today')return {period,title:'21 мая 2026, 09:00–20:00',records:HOURLY_REVENUE,total:DAY_REVENUE,selected:8};
  let records;
  if(period==='week')records=DAILY_REVENUE.slice(-7);
  else if(period==='month')records=DAILY_REVENUE;
  else if(period==='custom'){
    const valid=d=>/^2026-05-(0[1-9]|1\d|2[01])$/.test(d || '');
    if(!valid(range.from)||!valid(range.to)||range.from>range.to)throw new RangeError('Выберите даты с 1 по 21 мая; начало не может быть позже конца.');
    records=DAILY_REVENUE.filter(r=>r.date>=range.from&&r.date<=range.to);
  }else throw new RangeError('Неизвестный период');
  return {period,title:(records[0].label===records.at(-1).label?records[0].label:records[0].label+'–'+records.at(-1).label)+' мая 2026',records,total:sum(records.map(r=>r.value)),selected:records.length-1};
}
export function getSummary() {
  return {work:12,workChange:percentChange(12,11),monthRevenue:MONTH_REVENUE,monthChange:percentChange(MONTH_REVENUE,1135364),dayRevenue:DAY_REVENUE,dayChange:percentChange(DAY_REVENUE,PREVIOUS_DAY_REVENUE),orderCount:sum(CHANNELS.map(c=>c.orders))};
}
function csvCell(value) {return '"'+String(value).replaceAll('"','""')+'"';}
export function createSummaryCsv(period='today',range={},monthIndex=2) {
  const report=getRevenuePeriod(period,range),orders=getOrderMonth(monthIndex);
  const rows=[['4sales CRM — демонстрационные данные'],['Дата снимка',SNAPSHOT.date],[],['Эффективность каналов','Май 2026, по 21 мая'],['Канал','Выручка, ₽','Заказы','Средний чек, ₽','Конверсия, %','Статус'],...getChannels().map(c=>[c.name,c.revenue,c.orders,c.average,c.conversion,c.active?'Активен':'Не активен']),['Итого',MONTH_REVENUE,getSummary().orderCount],[],['Выручка',report.title],['Час / день','Выручка, ₽'],...report.records.map(r=>[r.label,r.value]),['Итого',report.total],[],['Заказы по каналам',orders.name+' 2026'],['Канал','Количество','Доля, %'],...CHANNELS.map((c,i)=>[c.legend,orders.channels[i],orders.shares[i]]),['Итого',orders.count,100]];
  return '\uFEFF'+rows.map(row=>row.map(csvCell).join(';')).join('\r\n')+'\r\n';
}
