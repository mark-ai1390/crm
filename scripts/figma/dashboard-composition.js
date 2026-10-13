// Inject DATA from the same store used by the web prototype.
const page=await figma.getNodeByIdAsync('3018:18793');await figma.setCurrentPageAsync(page);
const content=await figma.getNodeByIdAsync('3022:18830');
if(content.children.some(n=>n.name==='Channels and recent orders'))return {alreadyApplied:true};
const created=[],changed=[],removed=[];
const vars=await figma.variables.getLocalVariablesAsync(),by=Object.fromEntries(vars.map(v=>[v.name,v]));
const styles=await figma.getLocalTextStylesAsync();const sty=n=>styles.find(s=>s.name===n);
const paint=name=>figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:1,g:1,b:1}},'color',by[name]);
for(const name of ['TEXT/Small/Regular','TEXT/Small/Medium','TEXT/ExtraSmall/Regular','TEXT/Metric'])await figma.loadFontAsync(sty(name).fontName);
const track=n=>{created.push(n.id);return n;};
function flow(parent,name,direction='HORIZONTAL',gap=12){const n=track(figma.createAutoLayout(direction));parent.appendChild(n);n.name=name;n.fills=[];n.itemSpacing=gap;return n;}
function text(parent,value,style='TEXT/Small/Regular',color='color/text/primary'){const t=track(figma.createText());parent.appendChild(t);t.characters=String(value);t.textStyleId=sty(style).id;t.fills=[paint(color)];return t;}
const last=await figma.getNodeByIdAsync('3022:18928');
for(const t of last.findAllWithCriteria({types:['TEXT']}))for(const s of t.getStyledTextSegments(['fontName']))await figma.loadFontAsync(s.fontName);
const lower=flow(content,'Channels and recent orders','HORIZONTAL',20);lower.resize(1156,242);lower.layoutSizingHorizontal='FILL';lower.layoutSizingVertical='FIXED';
const master=await figma.getNodeByIdAsync('3019:18920');const card=track(master.createInstance());lower.appendChild(card);card.name='Card / Заказы по каналам';card.resize(480,242);card.setProperties({'Title#3019:107':'Заказы по каналам'});
const slot=card.findAllWithCriteria({types:['SLOT']})[0];const body=flow(slot,'Channel distribution','HORIZONTAL',20);body.resize(440,164);body.layoutSizingHorizontal='FILL';body.counterAxisAlignItems='CENTER';
const ring=track(figma.createFrame());body.appendChild(ring);ring.name='Donut / counts from orders';ring.resize(144,144);ring.fills=[];
const colors=['color/action/accent/bg','color/navigation/sidebar-item-bg-active','color/text/secondary','color/status/success/text'];let angle=-Math.PI/2;
for(let i=0;i<DATA.channels.length;i++){const channel=DATA.channels[i];const arc=track(figma.createEllipse());ring.appendChild(arc);arc.name=channel.name+' / '+channel.count;arc.resize(144,144);const end=angle+Math.PI*2*channel.count/DATA.total;arc.arcData={startingAngle:angle,endingAngle:end,innerRadius:.78};arc.fills=[paint(colors[i])];angle=end;}
const count=text(ring,DATA.total,'TEXT/Metric');count.x=(144-count.width)/2;count.y=46;const label=text(ring,'заказов','TEXT/ExtraSmall/Regular','color/text/secondary');label.x=(144-label.width)/2;label.y=82;
const legend=flow(body,'Channel legend','VERTICAL',10);legend.resize(260,132);legend.layoutSizingHorizontal='FILL';
for(let i=0;i<DATA.channels.length;i++){const ch=DATA.channels[i],row=flow(legend,'go:orders / '+ch.name);row.resize(260,24);row.layoutSizingHorizontal='FILL';row.counterAxisAlignItems='CENTER';const dot=track(figma.createEllipse());row.appendChild(dot);dot.resize(8,8);dot.fills=[paint(colors[i])];const name=text(row,ch.name);name.layoutSizingHorizontal='FILL';text(row,ch.count+' · '+Math.round(ch.count/DATA.total*100)+'%','TEXT/ExtraSmall/Regular','color/text/secondary');await row.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:'3022:19016',navigation:'NAVIGATE',transition:null,resetScrollPosition:true}]}]);}
lower.appendChild(last);last.resize(656,242);last.layoutSizingHorizontal='FILL';changed.push(last.id);
const tableSlot=last.findAllWithCriteria({types:['SLOT']})[0];for(const n of [...tableSlot.children]){removed.push(n.id);n.remove();}
const table=flow(tableSlot,'Recent orders / compact','VERTICAL',0);table.resize(616,176);table.layoutSizingHorizontal='FILL';
for(const [index,order]of DATA.latest.entries()){const row=flow(table,'go:order / '+order.id);row.resize(616,52);row.layoutSizingHorizontal='FILL';row.counterAxisAlignItems='CENTER';const id=text(row,'#'+order.id,'TEXT/Small/Medium','color/action/accent/bg-hover');id.resize(70,20);const customer=text(row,order.name);customer.layoutSizingHorizontal='FILL';text(row,order.amount.replace(',00',''),'TEXT/Small/Medium');if(index===0)await row.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:'3022:19282',navigation:'NAVIGATE',transition:null,resetScrollPosition:true}]}]);}
const metrics=await figma.getNodeByIdAsync('3022:18837');metrics.resize(1156,156);changed.push(metrics.id);
const work=await figma.getNodeByIdAsync('3022:18854');work.resize(1156,300);changed.push(work.id);for(const c of work.children){c.resize(c.width,300);changed.push(c.id);}
content.overflowDirection='VERTICAL';content.clipsContent=true;changed.push(content.id);
return {createdNodeIds:created,mutatedNodeIds:changed,removedNodeIds:removed,lowerRow:lower.id,channelCard:card.id};
