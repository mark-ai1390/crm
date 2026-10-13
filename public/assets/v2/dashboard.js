import {esc,href} from './ui.js';

export function channelCounts(orders) {
  const names=[...new Set(['Сайт','Маркетплейс','Чат','Офлайн',...orders.map(o=>o.channel)])];
  return names.map((name,index)=>({name,count:orders.filter(o=>o.channel===name).length,color:index%4})).filter(c=>c.count>0);
}

export function channelChart(orders,from,to) {
  const channels=channelCounts(orders),total=orders.length;
  let offset=0;
  const arcs=channels.map(channel=>{
    const share=channel.count/total*100;
    const circle=`<circle cx="80" cy="80" r="63" pathLength="100" stroke="var(--channel-${channel.color})" stroke-dasharray="${share} ${100-share}" stroke-dashoffset="${-offset}"/>`;
    offset+=share;return circle;
  }).join('');
  return `<div class="channel-chart"><div class="channel-ring"><svg viewBox="0 0 160 160" role="img" aria-label="${total} заказов за выбранный период"><g fill="none" stroke-width="16" transform="rotate(-90 80 80)"><circle cx="80" cy="80" r="63" stroke="var(--border-default)"/>${arcs}</g></svg><div class="channel-total" aria-hidden="true"><strong>${total}</strong><small>заказов</small></div></div><div class="channel-legend">${channels.map(c=>`<a href="${esc(href('orders',{channel:c.name,from,to}))}" class="channel-row"><i style="background:var(--channel-${c.color})" aria-hidden="true"></i><span>${esc(c.name)}</span><small>${c.count} · ${new Intl.NumberFormat('ru-RU',{maximumFractionDigits:1}).format(c.count/total*100)}%</small></a>`).join('')||'<p class="muted">В этом периоде заказов нет.</p>'}</div></div>`;
}
