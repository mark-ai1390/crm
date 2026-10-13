// Evolves the original sidebar and Profile IDs. Existing v2 sidebar is read only.
const page=await figma.getNodeByIdAsync('394:13480');
await figma.setCurrentPageAsync(page);
const created=[],mutated=[],removed=[];
const variables=await figma.variables.getLocalVariablesAsync();
const byName=Object.fromEntries(variables.map(v=>[v.name,v]));
const navBg=await figma.variables.getVariableByIdAsync('VariableID:117:13634');
const paint=v=>figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:1,g:1,b:1}},'color',v);
async function fonts(root){for(const t of root.findAllWithCriteria({types:['TEXT']}))for(const s of t.getStyledTextSegments(['fontName']))await figma.loadFontAsync(s.fontName);}
function track(root){created.push(root.id,...root.findAll().filter(n=>!n.id.startsWith('I')).map(n=>n.id));}
const profile=await figma.getNodeByIdAsync('784:34937');
await fonts(profile);
let details=Object.keys(profile.componentPropertyDefinitions).find(k=>k.startsWith('Show details#'));
if(!details) details=profile.addComponentProperty('Show details','BOOLEAN',true);
for(const id of ['784:34932','784:34934']){const n=await figma.getNodeByIdAsync(id);n.componentPropertyReferences={...n.componentPropertyReferences,visible:details};mutated.push(n.id);}
profile.fills=[paint(navBg)];profile.effects=[];profile.resize(196,44);mutated.push(profile.id);
const results=[];
for(const [sourceId,targetId,compact]of [['3020:18702','394:15594',false],['3020:18798','394:15628',true]]){
  const source=await figma.getNodeByIdAsync(sourceId),target=await figma.getNodeByIdAsync(targetId);
  await fonts(source);await fonts(target);
  // This operation is intentionally limited to the two inspected original variants.
  for(const child of [...target.children]){
    if(child.type==='COMPONENT'||child.type==='COMPONENT_SET'||('findAllWithCriteria'in child&&child.findAllWithCriteria({types:['COMPONENT','COMPONENT_SET']}).length))throw new Error('Nested master must be preserved');
    removed.push(child.id,...('findAll'in child?child.findAll().filter(n=>!n.id.startsWith('I')).map(n=>n.id):[]));child.remove();
  }
  target.layoutMode='VERTICAL';target.resize(compact?88:228,960);
  target.primaryAxisSizingMode='FIXED';target.counterAxisSizingMode='FIXED';
  target.paddingLeft=16;target.paddingRight=16;target.paddingTop=24;target.paddingBottom=20;
  target.itemSpacing=16;target.counterAxisAlignItems=compact?'CENTER':'MIN';target.fills=[paint(navBg)];target.clipsContent=true;
  for(const child of source.children){
    if(['Flexible spacer','go:profile'].includes(child.name))continue;
    const n=child.clone();target.appendChild(n);track(n);
    const width=compact?56:196;n.resize(width,child.height);n.layoutSizingHorizontal='FILL';
    if(n.name==='Brand'){
      n.resize(width,32);n.counterAxisAlignItems='CENTER';n.primaryAxisAlignItems=compact?'CENTER':'MIN';
      if(!compact&&n.children[0]){n.children[0].resize(108,21);}
    }
    if(n.name==='Navigation'){
      n.resize(width,600);n.layoutSizingVertical='FILL';n.overflowDirection='VERTICAL';n.clipsContent=true;
      for(const item of n.children){item.resize(width,44);item.layoutSizingHorizontal='FILL';if(compact){item.paddingLeft=8;item.paddingRight=8;item.primaryAxisAlignItems='CENTER';}}
    }
    if(n.name==='Workspace switcher'){n.resize(width,40);n.cornerRadius=8;n.primaryAxisAlignItems=compact?'CENTER':'MIN';}
    if(n.name==='go:compact'||n.name==='go:overview'&&child===source.children[source.children.length-2]){
      n.name=compact?'action:expand':'action:collapse';n.resize(width,40);
      if(compact){n.paddingLeft=8;n.paddingRight=8;n.primaryAxisAlignItems='CENTER';}
    }
  }
  const account=profile.createInstance();target.appendChild(account);account.name='go:profile';
  account.setProperties({[details]:!compact});account.resize(compact?44:196,44);
  if(!compact)account.layoutSizingHorizontal='FILL';track(account);
  target.description='Canonical 4sales sidebar. Based on the author side-menu and Profile masters. Scroll the middle navigation; keep profile 20 px from the bottom.';
  mutated.push(target.id);
  results.push({id:target.id,width:target.width,height:target.height,profileId:account.id,bottomInset:target.height-account.y-account.height,navigation:target.children.find(n=>n.name==='Navigation').id});
}
return {createdNodeIds:created,mutatedNodeIds:mutated,removedNodeIds:removed,profileDetailsProperty:details,variants:results};
