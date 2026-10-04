const KEY='4sales:sidebar:v1';
export function readSidebarState(storage) {
  const initial={compact:false,salesOpen:false,inventoryOpen:false};
  try {const raw=JSON.parse(storage?.getItem(KEY)||'null');if(!raw||typeof raw!=='object')return initial;for(const key of Object.keys(initial))if(typeof raw[key]==='boolean')initial[key]=raw[key];}
  catch { /* Навигация работает и без доступного хранилища. */ }
  return initial;
}
export function saveSidebarState(storage,state) {try{storage?.setItem(KEY,JSON.stringify({compact:!!state.compact,salesOpen:!!state.salesOpen,inventoryOpen:!!state.inventoryOpen}));}catch{/* Только удобство интерфейса. */}}
export function changeBranch(state,group,open=!state[group+'Open']) {
  if(!['sales','inventory'].includes(group))throw new RangeError('Неизвестный раздел');
  return {...state,[group+'Open']:!!open,...(group==='inventory'&&open?{salesOpen:true}:{})};
}
export function initSidebar() {
  const sidebar=document.querySelector('#sidebar'),content=document.querySelector('#app-content'),mobileButton=document.querySelector('.mobile-menu'),backdrop=document.querySelector('.mobile-backdrop'),collapse=document.querySelector('.sidebar-toggle');
  let storage;try{storage=window.sessionStorage;}catch{/* Используется состояние текущей страницы. */}
  let state=readSidebarState(storage),mobileOpen=false;
  const media=window.matchMedia('(max-width:900px)');
  const triggers=[...sidebar.querySelectorAll('[data-group]')];
  for(const row of sidebar.querySelectorAll('.nav-row[title]'))row.setAttribute('aria-label',row.title);
  sidebar.querySelector('.mobile-sidebar-close').addEventListener('click',()=>closeMobile());
  function render(){
    document.body.classList.toggle('is-compact',state.compact);
    collapse.setAttribute('aria-expanded',String(!state.compact));
    collapse.setAttribute('aria-label',state.compact?'Развернуть меню':'Свернуть меню');
    for(const button of triggers){const open=state[button.dataset.group+'Open'];button.setAttribute('aria-expanded',String(open));document.getElementById(button.getAttribute('aria-controls')).hidden=!open;}
    sidebar.inert=media.matches&&!mobileOpen;
    content.inert=media.matches&&mobileOpen;
    document.body.classList.toggle('sidebar-open',media.matches&&mobileOpen);
    backdrop.hidden=!(media.matches&&mobileOpen);
    mobileButton.setAttribute('aria-expanded',String(mobileOpen));
    mobileButton.setAttribute('aria-label',mobileOpen?'Закрыть меню':'Открыть меню');
    saveSidebarState(storage,state);
  }
  function closeMobile(restore=true){mobileOpen=false;render();if(restore&&media.matches)mobileButton.focus();}
  function visibleControls(){return [...sidebar.querySelectorAll('button,a[href]')].filter(el=>!el.closest('[hidden]')&&getComputedStyle(el).display!=='none');}
  for(const button of triggers)button.addEventListener('click',()=>{
    if(state.compact&&!media.matches){state={...state,compact:false};state=changeBranch(state,button.dataset.group,true);}
    else state=changeBranch(state,button.dataset.group);
    render();
  });
  collapse.addEventListener('click',()=>{state={...state,compact:!state.compact};render();});
  mobileButton.addEventListener('click',()=>{mobileOpen=!mobileOpen;render();if(mobileOpen)sidebar.querySelector('.nav-row').focus();});
  backdrop.addEventListener('click',()=>closeMobile());
  media.addEventListener('change',()=>{mobileOpen=false;render();});
  sidebar.addEventListener('keydown',event=>{
    if(event.key==='Tab'&&media.matches&&mobileOpen){const list=visibleControls(),first=list[0],last=list.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}return;}
    if(event.key==='ArrowRight'){const button=event.target.closest('[data-group]');if(button){event.preventDefault();state={...state,compact:false};state=changeBranch(state,button.dataset.group,true);render();document.getElementById(button.getAttribute('aria-controls')).querySelector('button').focus();}return;}
    if(!['Escape','ArrowLeft'].includes(event.key))return;
    let branch=event.target.closest('[data-branch]');
    while(branch&&!state[branch.dataset.branch+'Open'])branch=branch.parentElement.closest('[data-branch]');
    if(branch){event.preventDefault();state=changeBranch(state,branch.dataset.branch,false);render();branch.querySelector('[data-group]').focus();}
    else if(event.key==='Escape'&&mobileOpen){event.preventDefault();closeMobile();}
  });
  render();
  return {closeMobile,restoreFocus(element){if(media.matches&&!mobileOpen&&sidebar.contains(element))mobileButton.focus();else if(element?.isConnected)element.focus();}};
}
