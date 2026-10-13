import test from 'node:test';
import assert from 'node:assert/strict';
import {seed} from '../public/assets/v2/seed.js';
import {metrics,command} from '../public/assets/v2/model.js';
import {view,filteredOrders} from '../public/assets/v2/views.js';
import {channelCounts,channelChart} from '../public/assets/v2/dashboard.js';

test('Каналы дашборда ведут к тем же заказам и периоду после изменения заказа',()=>{
  const s=structuredClone(seed),o=s.orders.at(-1);
  const updated=command(s,'order.save',{...o,channel:'Офлайн',method:o.delivery.method,address:o.delivery.address}).state;
  for(const state of [s,updated])for(const period of [{from:'2026-10-01',to:'2026-10-12'},{from:'2026-10-12',to:'2026-10-12'}]){
    const orders=metrics(state,period.from,period.to).orders;
    const html=channelChart(orders,period.from,period.to);
    const counts=channelCounts(orders);
    assert.equal(counts.reduce((sum,c)=>sum+c.count,0),orders.length);
    const links=[...html.matchAll(/href="([^"]+)"/g)].map(m=>m[1].replaceAll('&amp;','&'));
    assert.equal(links.length,counts.length);
    links.forEach((link,i)=>{
      const [path,query]=link.split('?');assert.equal(path,'#/orders');
      const q=Object.fromEntries(new URLSearchParams(query));
      assert.equal(q.from,period.from);assert.equal(q.to,period.to);
      assert.equal(filteredOrders(state,q).length,counts[i].count);
    });
  }
});

test('Пустой период не рисует NaN, а цвет канала сохраняется при фильтрации',()=>{
  const q={from:'2027-01-01',to:'2027-01-02'},html=view(seed,'overview',q);
  assert(html.includes('В этом периоде заказов нет.'));
  assert(!/NaN|Infinity/.test(html));
  for(const c of channelCounts(seed.orders)){
    const only=channelCounts(seed.orders.filter(o=>o.channel===c.name));
    assert.equal(only[0].color,c.color);
  }
});
