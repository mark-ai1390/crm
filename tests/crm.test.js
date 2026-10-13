import test from 'node:test';
import assert from 'node:assert/strict';
import {makeStore,orderTotals,validateOrder,csv} from '../public/assets/js/crm-data.js';
test('Заказ учитывает количество, скидку, доставку и частичную оплату',()=>{
  const data=makeStore().data;
  const order={clientId:data.clients[0].id,items:[{productId:data.products[0].id,qty:2},{productId:data.products[1].id,qty:1}],discount:500,deliveryCost:300,paid:10000};
  assert.deepEqual(orderTotals(order,data.products),{subtotal:20580,discount:500,total:20380,remaining:10380});
  assert.equal(validateOrder(order,data),'');
  order.items[0].qty=100;
  assert.match(validateOrder(order,data),/остатка/);
  order.items[0].qty=1;order.paid=100000;
  assert.match(validateOrder(order,data),/превышать/);
});
test('Созданные клиент и заказ восстанавливаются из сохранённого состояния',()=>{
  const memory=new Map(),storage={getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)};
  const store=makeStore(storage);
  store.data.clients.push({id:'new-client',name:'Проверка'});
  const order={id:999999,clientId:'new-client',items:[{productId:store.data.products[0].id,qty:1}],discount:0,deliveryCost:0,paid:0};
  assert.equal(validateOrder(order,store.data),'');
  store.data.orders.push(order);
  assert(store.save());
  const restored=makeStore(storage);
  assert.equal(restored.data.orders.at(-1).clientId,restored.data.clients.at(-1).id);
  assert.equal(orderTotals(restored.data.orders.at(-1),restored.data.products).total,4290);
});
test('Недоступное хранилище и повреждённый JSON не ломают демонстрацию',()=>{
  assert.equal(makeStore({getItem:()=>'{broken'}).data.orders.length,32);
  assert.equal(makeStore({getItem:()=>null,setItem:()=>{throw Error('denied');}}).save(),false);
});
test('Оплаченные заказы имеют нулевой остаток, ссылки на клиента и менеджера существуют',()=>{
  const d=makeStore().data;
  for(const o of d.orders){
    assert(d.clients.some(c=>c.id===o.clientId));assert(d.managers.some(m=>m.id===o.managerId));
    assert.equal(validateOrder(o,d),'');
    if(o.payment==='Оплачен')assert.equal(orderTotals(o,d.products).remaining,0);
  }
  for(const m of d.messages){assert(d.clients.some(c=>c.id===m.clientId));assert(d.managers.some(x=>x.id===m.managerId));}
});
test('CSV сохраняет кавычки, переносы строк и обезвреживает формулы',()=>{
  const result=csv([{name:'=SUM(A1)',email:'a"b\nc'}],[{key:'name',label:'Имя'},{key:'email',label:'Почта'}]);
  assert(result.startsWith('\uFEFF'));assert(result.includes('"\'=SUM(A1)"'));assert(result.includes('"a""b\nc"'));
});
