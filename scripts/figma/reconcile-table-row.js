// Extend the author's original family. Exact IDs; keep legacy variants intact.
await figma.setCurrentPageAsync(await figma.getNodeByIdAsync('3018:18792'));
const set=await figma.getNodeByIdAsync('907:23483');
const old=await figma.getNodeByIdAsync('3019:18910');
if(!old)return {alreadyReconciled:true,setId:set.id};
const fonts=new Map();
for(const root of [set,old])for(const t of root.findAllWithCriteria({types:['TEXT']}))for(const s of t.getStyledTextSegments(['fontName']))fonts.set(JSON.stringify(s.fontName),s.fontName);
await Promise.all([...fonts.values()].map(f=>figma.loadFontAsync(f)));
const changed=new Set([set.id]),created=[],removed=[],variants=[];
const vars=await figma.variables.getLocalVariablesAsync();
const variable=id=>vars.find(v=>v.id==='VariableID:'+id);
const paint=id=>figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:1,g:1,b:1}},'color',variable(id));
const fields=['Record','Customer','Status','Payment','Manager','Amount'];
const keys={};for(const field of fields){const source=Object.entries(old.componentPropertyDefinitions).find(([k])=>k.startsWith(field+'#'));keys[field]=Object.keys(set.componentPropertyDefinitions).find(k=>k.startsWith(field+'#'))||set.addComponentProperty(field,'TEXT',source[1].defaultValue);}
const base=await figma.getNodeByIdAsync('907:23413');
const checked=await figma.getNodeByIdAsync('2:30084');
for(const c of set.children){if(c.id==='907:23413'||c.id==='907:23414'){c.name=c.name.split(',')[0]+', State='+ (c.id==='907:23414'?'Selected':'Default')+', Density=Comfortable';changed.add(c.id);}}
for(const source of old.children){
 const state=source.variantProperties.State,density=source.variantProperties.Density;
 const name='type=Sales, State='+state+', Density='+density;
 let c=set.children.find(n=>n.name===name);
 if(!c){c=base.clone();set.appendChild(c);c.name=name;}
 c.resize(1100,density==='Compact'?44:56);c.paddingLeft=16;c.paddingRight=16;c.paddingTop=0;c.paddingBottom=0;c.itemSpacing=16;c.counterAxisAlignItems='CENTER';
 c.setBoundVariable('paddingLeft',variable('774:22324'));c.setBoundVariable('paddingRight',variable('774:22324'));c.setBoundVariable('itemSpacing',variable('774:22324'));
 c.fills=[paint(state==='Default'?'117:13533':'117:13537')];c.strokes=[paint('117:13564')];c.strokeTopWeight=0;c.strokeLeftWeight=0;c.strokeRightWeight=0;c.strokeBottomWeight=1;
 const record=c.children[0],slot=c.children.find(n=>n.type==='SLOT'||n.name==='Slot');
 record.resize(114,20);record.layoutSizingHorizontal='FIXED';record.itemSpacing=8;record.setBoundVariable('itemSpacing',variable('774:22320'));
 const cb=record.findOne(n=>n.type==='INSTANCE');if(state==='Selected')cb.swapComponent(checked);
 const rt=record.findOne(n=>n.type==='TEXT');rt.componentPropertyReferences={characters:keys.Record};rt.characters='#1048';rt.fills=[paint('117:13541')];
 for(const child of [...slot.children]){removed.push(child.id);child.remove();}
 slot.resize(880,20);slot.layoutSizingHorizontal='FILL';slot.itemSpacing=12;slot.setBoundVariable('itemSpacing',variable('774:22322'));slot.counterAxisAlignItems='CENTER';slot.paddingTop=0;slot.paddingBottom=0;
 const widths={Customer:190,Status:135,Payment:155,Manager:155,Amount:106};
 for(const field of fields.slice(1)){
  const t=source.children.find(n=>n.type==='TEXT'&&n.name===field).clone();slot.appendChild(t);t.componentPropertyReferences={characters:keys[field]};t.textAutoResize='HEIGHT';t.resize(widths[field],20);t.layoutSizingHorizontal=field==='Customer'?'FILL':'FIXED';t.textAlignHorizontal=field==='Amount'?'RIGHT':'LEFT';t.fills=[paint(field==='Payment'?'117:13542':'117:13541')];
 }
 variants.push({id:c.id,name:c.name});created.push(c.id,...c.findAll().map(n=>n.id));
}
set.name='Table / Row';set.description='Original 4sales row family. Legacy slot layouts are preserved. Sales rows expose record, customer, status, payment, manager and amount in two densities and three states.';
// Use the vacant lower area of the existing Table group, without moving other assets.
set.x=41;set.y=2580;
set.children.forEach((c,i)=>{c.x=20+(i%2)*1190;c.y=20+Math.floor(i/2)*80;changed.add(c.id);});set.resizeWithoutConstraints(2388,340);
const sample=await figma.getNodeByIdAsync('3020:18921');const values=Object.fromEntries(Object.entries(sample.componentProperties).filter(([,v])=>v.type==='TEXT').map(([k,v])=>[k.split('#')[0],v.value]));
const width=sample.width;sample.swapComponent(await figma.getNodeByIdAsync(variants[0].id));sample.resize(width,56);sample.layoutSizingHorizontal='FILL';sample.name='Table / Row';sample.setProperties(Object.fromEntries(fields.map(f=>[keys[f],values[f]])));changed.add(sample.id);
return {setId:set.id,createdNodeIds:created,mutatedNodeIds:[...changed],removedCloneNodeIds:removed,variants,properties:keys,migratedInstance:sample.id};
