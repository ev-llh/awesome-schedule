/* @map:actions-click — every [data-act] button is handled in this one switch. To add a button: add data-act in 40-render.js, add a case here. */
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-act]');if(!el)return;
  const a=el.dataset.act,id=el.dataset.id;
  switch(a){
    case 'tab':ui.view=+el.dataset.i;render();break;
    case 'lang':S.lang=S.lang==='en'?'zh':'en';save();render();break;
    /* @map:theme-switch */
    case 'theme':S.theme=THEMES[(THEMES.indexOf(S.theme)+1)%THEMES.length];save();render();break;
    case 'sheet':ui.sheet=el.dataset.s;render();break;
    case 'closeSheet':ui.sheet=null;render();break;
    /* @map:popout */
    case 'popout':window.open(location.href,'dailybrush','popup=yes,width=460,height='+Math.min(screen.availHeight||900,920));break;
    case 'addOpen':ui.addOpen=true;ui.focusAdd=true;render();break;
    case 'addClose':ui.addOpen=false;render();break;
    case 'now':S.nowId=id;save();render();break;
    case 'toggle':{const it=find(id);if(it)complete(it);break;}
    case 'del':{S.tasks=S.tasks.filter(x=>x.id!==id);if(S.nowId===id)S.nowId=null;if(S.run&&S.run.id===id)S.run=null;save();render();break;}
    case 'skip':{const n=nowItem(BLOCKS[ui.view]);if(n){n.ord=Date.now();S.nowId=null;if(S.run&&S.run.id===n.id)S.run=null;save();render();}break;}
    /* @map:timer */
    case 'start':{const n=nowItem(BLOCKS[ui.view]);if(n){S.nowId=n.id;S.run={id:n.id,end:Date.now()+S.timer*60000,total:S.timer*60000,fin:false};save();render();}break;}
    case 'stop':S.run=null;document.title='日課 · '+t('today');save();render();break;
    case 'plus5':if(S.run){S.run.end=Math.max(S.run.end,Date.now())+5*60000;S.run.total=Math.max(S.run.total,S.run.end-Date.now());S.run.fin=false;save();render();}break;
    case 'laterHere':{const it=find(id),c=curIdx();if(!it)break;if(pending(BLOCKS[c])>=S.cap){toast(t('noRoom'));break;}it.block=BLOCKS[c];it.ord=Date.now();save();ui.view=c;ui.sheet=null;render();toast(t('moved'));break;}
    case 'parkLater':{const p=S.parked.find(x=>x.id===id);if(p){S.tasks.push({id:uid('t'),text:p.text,block:'later',ord:Date.now(),done:false});S.parked=S.parked.filter(x=>x.id!==id);save();render();}break;}
    case 'parkDel':S.parked=S.parked.filter(x=>x.id!==id);save();render();break;
    case 'parkClear':S.parked=[];save();render();break;
    case 'rtDel':S.routines=S.routines.filter(x=>x.id!==id);delete S.routineDone[id];save();render();break;
    /* @map:export-import — JSON backup (contains the user's tasks: never commit backups) */
    case 'export':{const b=new Blob([JSON.stringify(S,null,1)],{type:'application/json'});const u=URL.createObjectURL(b);const l=document.createElement('a');l.href=u;l.download='daily-brush-backup.json';l.click();setTimeout(()=>URL.revokeObjectURL(u),500);break;}
    case 'import':$('#imp').click();break;
  }
});
$('#imp').addEventListener('change',e=>{
  const f=e.target.files[0];if(!f)return;
  f.text().then(x=>{const o=JSON.parse(x);if(!Array.isArray(o.tasks)||!Array.isArray(o.routines))throw 0;S=Object.assign(structuredClone(DEF),o);save();rollover();render();toast(t('ok'));}).catch(()=>toast(t('bad')));
  e.target.value='';
});

/* @map:actions-forms — submit handlers: park (footer input), add (task or daily routine), routine (Routines sheet) */
document.addEventListener('submit',e=>{
  const f=e.target.closest('[data-form]');if(!f)return;e.preventDefault();
  const kind=f.dataset.form;
  if(kind==='park'){
    const i=$('#parkin'),v=i.value.trim();if(!v)return;
    S.parked.unshift({id:uid('p'),text:v,ts:Date.now()});save();i.value='';i.blur();
    const n=nowItem(BLOCKS[curIdx()]);toast(t('parkedToast')+(n?' '+n.text:''));renderChips();renderHead();
    return;
  }
  const text=f.elements.text.value.trim();if(!text)return;
  let block=f.elements.block.value;
  if(kind==='add'){
    const routine=f.elements.routine&&f.elements.routine.checked;
    if(routine){
      if(block==='later')block=BLOCKS[curIdx()];
      if(staticLoad(block)>=S.cap){toast(t('routineFull'));return;}
      S.routines.push({id:uid('r'),text,block,ord:Date.now()});
    }else addTask(text,block);
    ui.addOpen=false;
  }else if(kind==='routine'){
    if(staticLoad(block)>=S.cap){toast(t('routineFull'));return;}
    S.routines.push({id:uid('r'),text,block,ord:Date.now()});
  }
  save();render();
});

/* @map:actions-input — Now-card fields (step / cue / note) save on every keystroke WITHOUT re-render (keeps focus); selects/checkboxes in Settings */
document.addEventListener('input',e=>{
  const el=e.target;if(!el.dataset.f)return;
  const card=el.closest('.now');if(!card)return;
  const it=find(card.dataset.id);if(it){it[el.dataset.f]=el.value;save();}
});
document.addEventListener('change',e=>{
  const el=e.target;
  if(el.id==='tmin'){S.timer=+el.value;save();return;}
  const k=el.dataset.set;if(!k)return;
  if(k==='cap')S.cap=+el.value;
  else if(k==='timer')S.timer=+el.value;
  else if(k==='chime')S.chime=el.checked;
  else if(k[0]==='h'){S.hours[+k[1]]=+el.value;}
  save();rollover();render();
});

/* @map:actions-keys — P = park a thought, N = new item, Esc = close sheet/form */
document.addEventListener('keydown',e=>{
  const tg=e.target,typing=/^(INPUT|TEXTAREA|SELECT)$/.test(tg.tagName);
  if(e.key==='Escape'){if(typing)tg.blur();ui.sheet=null;ui.addOpen=false;render();return;}
  if(typing||e.ctrlKey||e.metaKey||e.altKey)return;
  if(e.key==='p'||e.key==='P'){e.preventDefault();$('#parkin').focus();}
  else if(e.key==='n'||e.key==='N'){e.preventDefault();ui.addOpen=true;ui.focusAdd=true;render();}
});
