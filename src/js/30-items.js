/* @map:items — tasks (one-offs, id "t…") and routines (daily, id "r…") share one interface; a routine is "done" if routineDone[id]===today */
const isR=it=>it.id[0]==='r';
const isDone=it=>isR(it)?S.routineDone[it.id]===S.day:!!it.done;
function setDone(it,v){if(isR(it)){if(v)S.routineDone[it.id]=S.day;else delete S.routineDone[it.id];}else it.done=v;}
const find=id=>id[0]==='r'?S.routines.find(r=>r.id===id):S.tasks.find(x=>x.id===id);
const itemsIn=b=>[...S.routines.filter(r=>r.block===b),...S.tasks.filter(x=>x.block===b)].sort((a,b)=>(a.ord||0)-(b.ord||0));
function nowItem(b){const p=itemsIn(b).filter(x=>!isDone(x));return p.find(x=>x.id===S.nowId)||p[0]||null;}

/* @map:capacity-cap — the 3-item rule (S.cap). pending(): live count; staticLoad(): routines count even when ticked, so tomorrow can't overflow */
const pending=b=>itemsIn(b).filter(x=>!isDone(x)).length;
const staticLoad=b=>S.routines.filter(r=>r.block===b).length+S.tasks.filter(x=>x.block===b&&!x.done).length;
function addTask(text,block){
  if(block!=='later'&&pending(block)>=S.cap){block='later';toast(t('fullToast'));}
  S.tasks.push({id:uid('t'),text,block,ord:Date.now(),done:false});
}

/* @map:rollover — new day: done one-offs dropped, undone one-offs → Later, routines reset. Same day: unfinished one-offs of a passed block → Later (silently, no guilt). */
function rollover(){
  const dk=dayKey();
  if(S.day!==dk){
    S.tasks=S.tasks.filter(x=>!x.done).map(x=>Object.assign(x,{block:'later'}));
    S.routineDone={};S.day=dk;S.nowId=null;S.run=null;
  }
  const ci=curIdx();
  S.tasks.forEach(x=>{const bi=BLOCKS.indexOf(x.block);if(bi>=0&&bi<ci&&!x.done)x.block='later';});
  save();
}

/* @map:complete — tick/untick an item; ticking stamps the seal and advances "Now" */
function complete(it){
  const was=isDone(it);setDone(it,!was);
  if(S.run&&S.run.id===it.id)S.run=null;
  if(!was){stamp();S.nowId=null;}
  save();render();
}
