// Inject PAGE_ID; migrate the exact retired KPI variants to author masters.
const page=await figma.getNodeByIdAsync(PAGE_ID);await figma.setCurrentPageAsync(page);
const ids=[],migrated=[];
for(const n of page.findAllWithCriteria({types:['INSTANCE']}).filter(n=>['3019:18911','3019:18915'].includes(n.mainComponent?.id))){
 const values=Object.fromEntries(Object.entries(n.componentProperties).filter(([,v])=>v.type==='TEXT').map(([k,v])=>[k.split('#')[0],v.value]));
 const targetId=/оплачено|выручка/i.test(values.Title)?'1466:31845':/работе/i.test(values.Title)?'1466:31844':'1466:31843';
 const target=await figma.getNodeByIdAsync(targetId);
 for(const root of [n,target])for(const t of root.findAllWithCriteria({types:['TEXT']}))for(const s of t.getStyledTextSegments(['fontName']))await figma.loadFontAsync(s.fontName);
 const w=n.width,h=n.height,name=n.name,hs=n.layoutSizingHorizontal,vs=n.layoutSizingVertical;
 n.swapComponent(target);const props={};for(const [k,v]of Object.entries(n.componentProperties))if(v.type==='TEXT'&&values[k.split('#')[0]]!==undefined)props[k]=values[k.split('#')[0]];
 n.setProperties(props);n.resize(w,Math.max(156,h));n.name=name;n.layoutSizingHorizontal=hs;n.layoutSizingVertical=vs;
 if(n.parent.type==='FRAME'&&n.parent.layoutMode==='HORIZONTAL'&&n.parent.height<156){n.parent.resize(n.parent.width,156);ids.push(n.parent.id);}
 ids.push(n.id);migrated.push({id:n.id,target:targetId});
}
return {mutatedNodeIds:ids,migrated};
