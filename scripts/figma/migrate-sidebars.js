// Inject PAGE_ID. Run per page until remaining===0.
const page=await figma.getNodeByIdAsync(PAGE_ID);await figma.setCurrentPageAsync(page);
const map={'3020:18702':'394:15594','3020:18798':'394:15628'};
const candidates=page.findAllWithCriteria({types:['INSTANCE']}).filter(n=>map[n.mainComponent?.id]);
const changed=[],migrated=[];
const foreground=await figma.variables.getVariableByIdAsync('VariableID:117:13635');
const inverse=await figma.variables.getVariableByIdAsync('VariableID:117:13636');
const background=await figma.variables.getVariableByIdAsync('VariableID:117:13634');
const selected=await figma.variables.getVariableByIdAsync('VariableID:117:13637');
const paint=v=>figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:1,g:1,b:1}},'color',v);
async function fonts(n){for(const t of n.findAllWithCriteria({types:['TEXT']}))for(const s of t.getStyledTextSegments(['fontName']))await figma.loadFontAsync(s.fontName);}
for(const n of candidates.slice(0,6)){
  const old=n.mainComponent.id,compact=old==='3020:18798';
  const routes=n.findAll().filter(c=>c.name.startsWith('go:'));
  const interactions=Object.fromEntries(routes.map(c=>[c.name,c.reactions]));
  const active=routes.find(c=>c.type==='INSTANCE'&&c.componentProperties.State?.value==='on')?.name??'go:overview';
  const target=await figma.getNodeByIdAsync(map[old]);await fonts(n);await fonts(target);
  const w=n.width,h=n.height,hs=n.layoutSizingHorizontal,vs=n.layoutSizingVertical,name=n.name;
  n.swapComponent(target);n.resize(w,h);n.layoutSizingHorizontal=hs;n.layoutSizingVertical=vs;n.name=name;changed.push(n.id);
  for(const item of n.findAll().filter(c=>c.name.startsWith('go:')||c.name.startsWith('action:'))){
    const key=item.name==='action:collapse'?'go:compact':item.name==='action:expand'?'go:overview':item.name;
    if(interactions[key])await item.setReactionsAsync(interactions[key]);
    if(item.type==='INSTANCE'&&item.mainComponent?.parent?.id==='394:15508'){
      const isActive=item.name===active&&!item.name.startsWith('action:');
      item.setProperties({State:isActive?'on':'off'});
      item.fills=isActive?[paint(selected)]:[];
      const color=isActive?inverse:foreground;
      for(const child of item.findAllWithCriteria({types:['TEXT','VECTOR','BOOLEAN_OPERATION']})){
        if(child.type==='TEXT'){for(const s of child.getStyledTextSegments(['fontName']))await figma.loadFontAsync(s.fontName);child.fills=[paint(color)];changed.push(child.id);}
        else if(Array.isArray(child.fills)&&child.fills.some(p=>p.type==='SOLID')){child.fills=child.fills.map(p=>p.type==='SOLID'?paint(color):p);changed.push(child.id);}
      }
    }
    changed.push(item.id);
  }
  const profile=n.findOne(c=>c.name==='go:profile');
  migrated.push({id:n.id,compact,active,bottomInset:Math.round(n.height-profile.y-profile.height)});
}
return {pageId:page.id,mutatedNodeIds:changed,migrated,remaining:candidates.length-migrated.length};
