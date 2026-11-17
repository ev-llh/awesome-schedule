/* @map:toast — transient message; @map:stamp — red seal on completion; @map:chime — optional soft tone when the timer ends */
let toastT;
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>el.classList.remove('on'),2800);}
function stamp(){const el=document.createElement('div');el.className='stamp';el.textContent=STAMPS[Math.floor(Math.random()*STAMPS.length)];$('#app').appendChild(el);setTimeout(()=>el.remove(),1100);}
function chime(){
  if(!S.chime)return;
  try{const c=new (window.AudioContext||window.webkitAudioContext)();[523,659].forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain();o.frequency.value=f;o.type='sine';o.connect(g);g.connect(c.destination);const t0=c.currentTime+i*.28;g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(.08,t0+.04);g.gain.exponentialRampToValueAtTime(.0001,t0+.9);o.start(t0);o.stop(t0+1);});}catch(e){}
}

/* @map:render-head — title, clock, icon buttons, block tabs, brush progress bar */
function renderHead(){
  const L=S.lang,zh=L==='zh',cur=curIdx(),pr=progress(),d=new Date();
  const date=d.toLocaleDateString(zh?'zh-TW':'en-AU',{weekday:'short',month:'short',day:'numeric'});
  const tabs=BLOCKS.map((b,i)=>{
    const its=itemsIn(b);
    let dots='';its.slice(0,5).forEach(x=>{dots+=`<i class="${isDone(x)?'d':'p'}"></i>`;});
    if(!dots)dots='<i></i>';
    return `<button class="tab ${i===ui.view?'on':''}" data-act="tab" data-i="${i}" aria-label="${t(b)}"><b>${GL[b]}</b>${zh?'':`<small>${t(b)}</small>`}<span class="dots">${dots}</span>${i===cur?'<em></em>':''}</button>`;
  }).join('');
  $('#head').innerHTML=`
   <div class="top">
     <div class="seal">課</div>
     <div class="ttl"><b>${t('today')}</b><small>${esc(date)}${t('sub')?' · '+t('sub'):''}</small></div>
     <span id="clock">${pad(d.getHours())}:${pad(d.getMinutes())}</span>
     <button class="ib" data-act="lang" title="Language">${zh?'EN':'中文'}</button>
     <button class="ib" data-act="theme" title="${t('theme')}">◐</button>
     <button class="ib" data-act="sheet" data-s="settings" title="${t('settings')}">${t('set')}</button>
     ${window.innerWidth>700?`<button class="ib" data-act="popout" title="${t('popout')}">⧉</button>`:''}
   </div>
   <div class="tabs">${tabs}</div>
   <div class="prog"><span>${lbl(BLOCKS[cur])} · <span id="bleft">${leftText(pr.left)}</span></span><div class="brush"><i id="bprog" style="width:${Math.round(pr.p*100)}%"></i></div></div>`;
}

/* @map:render-rows — one task row */
function rowHTML(it){
  const d=isDone(it);
  return `<div class="row ${d?'done':''}"><button class="chk" data-act="toggle" data-id="${it.id}" aria-label="${t('done')}">✓</button><span class="txt" ${d?'':`data-act="now" data-id="${it.id}"`}>${esc(it.text)}</span>${isR(it)?'<span class="tag">日</span>':''}${(!isR(it)&&!d)?`<button class="x" data-act="del" data-id="${it.id}" aria-label="Delete">×</button>`:''}</div>`;
}

/* @map:render-now-card — the dark card: task, first step, if-then cue, resume note, start/timer buttons */
function nowCard(it){
  const running=S.run&&S.run.id===it.id;
  let acts;
  if(running){
    const left=Math.max(0,S.run.end-Date.now()),fin=left<=0;
    const pct=Math.min(100,Math.round((1-left/S.run.total)*100));
    acts=`<div class="tmr"><span id="tmr" class="${fin?'fin':''}">${fin?t('time'):fmtTimer(left)}</span><div class="brush"><i id="tbar" style="width:${pct}%"></i></div></div>
      <div class="btnrow"><button class="btn primary" data-act="toggle" data-id="${it.id}">✓ ${t('done')}</button><button class="btn" data-act="plus5">${t('plus5')}</button><button class="btn" data-act="stop">${t('stop')}</button></div>`;
  }else{
    acts=`<div class="btnrow"><select id="tmin" aria-label="${t('timer')}">${[5,10,15,25].map(m=>`<option value="${m}" ${m===S.timer?'selected':''}>${m} ${t('min')}</option>`).join('')}</select>
      <button class="btn primary" data-act="start">▶ ${t('start')}</button><button class="btn" data-act="toggle" data-id="${it.id}">✓ ${t('done')}</button><button class="btn" data-act="skip">${t('notNow')}</button></div>`;
  }
  const note=(running||it.note)?`<label class="fld"><span>${t('resume')}</span><input data-f="note" value="${esc(it.note||'')}" placeholder="${t('resumePh')}" maxlength="120"></label>`:'';
  return `<section class="now" data-id="${it.id}"><i class="motto">一事一刻</i>
    <div class="lab">${t('now')}${S.lang==='en'?' · 當下':''}</div><h2>${esc(it.text)}</h2>
    <label class="fld"><span>${t('firstStep')}</span><input data-f="step" value="${esc(it.step||'')}" placeholder="${t('firstStepPh')}" maxlength="100"></label>
    <label class="fld"><span>${t('cue')}</span><input data-f="cue" value="${esc(it.cue||'')}" placeholder="${t('cuePh')}" maxlength="120"></label>
    ${note}${acts}</section>`;
}

/* @map:render-main — current block: Now card + other pending rows + done rows + add button/form; peek banner for other blocks */
function blockOptions(sel){
  const ci=curIdx();let o='';
  BLOCKS.forEach((b,i)=>{if(i>=ci)o+=`<option value="${b}" ${b===sel?'selected':''}>${lbl(b)}</option>`;});
  return o+`<option value="later">${lbl('later')}</option>`;
}
function renderMain(){
  const b=BLOCKS[ui.view],cur=ui.view===curIdx();
  const its=itemsIn(b),pend=its.filter(x=>!isDone(x)),dn=its.filter(isDone);
  let h='';
  if(!cur)h+=`<div class="peek">${t('peek')} ${lbl(b)} · <button class="lnk" data-act="tab" data-i="${curIdx()}">${t('back')}</button></div>`;
  const now=cur?nowItem(b):null;
  if(now)h+=nowCard(now);
  else if(cur&&!pend.length)h+=`<div class="card clear"><b>歇</b><p>${t('blockClear')}</p></div>`;
  const rest=pend.filter(x=>!now||x.id!==now.id);
  if(rest.length)h+=`<div class="list">${rest.map(rowHTML).join('')}</div>`;
  if(dn.length)h+=`<div class="list done">${dn.map(rowHTML).join('')}</div>`;
  /* @map:render-add-form */
  if(ui.addOpen){
    h+=`<form class="addf" data-form="add"><input type="text" name="text" placeholder="${t('addPh')}" maxlength="120" autocomplete="off" required>
      <div class="addrow"><select name="block">${blockOptions(BLOCKS[Math.max(ui.view,curIdx())])}</select>
      <label><input type="checkbox" name="routine"> ${t('every')}</label>
      <button class="btn primary">${t('addGo')}</button><button type="button" class="btn" data-act="addClose">×</button></div></form>`;
  }else h+=`<button class="addbtn" data-act="addOpen">${t('add')}</button>`;
  $('#main').innerHTML=h;
  if(ui.focusAdd){const i=$('.addf input[name=text]');if(i)i.focus();ui.focusAdd=false;}
}

/* @map:render-chips — footer buttons 後 念 常 with counts (zh: glyph only, en: glyph + word) */
function renderChips(){
  const zh=S.lang==='zh',chip=(k,n)=>`<button class="chip" data-act="sheet" data-s="${k}" aria-label="${t(k)}"><b>${GL[k]}</b>${zh?'':t(k)}<u>${n||''}</u></button>`;
  $('#chips').innerHTML=chip('later',S.tasks.filter(x=>x.block==='later').length)+chip('parked',S.parked.length)+chip('routines',S.routines.length);
  $('#parkin').placeholder=t('parkPh');
}

/* @map:render-sheet — the unrolled scroll for Later / Parked / Routines / Settings */
function renderSheet(){
  const el=$('#sheet'),s=ui.sheet;
  el.classList.toggle('open',!!s);
  if(!s)return;                       // keep old content while it rolls up
  const title={later:lbl('later'),parked:lbl('parked'),routines:lbl('routines'),settings:t('settings')}[s];
  let body='';
  if(s==='later'){
    const L=S.tasks.filter(x=>x.block==='later').sort((a,b)=>(a.ord||0)-(b.ord||0));
    body=`<p class="empty" style="padding:0 0 8px;text-align:left;font-size:14px">${t('laterNote')}</p>`+(L.length?L.map(x=>`<div class="srow"><span>${esc(x.text)}</span><button class="btn" data-act="laterHere" data-id="${x.id}">${t('here')}</button><button class="x" data-act="del" data-id="${x.id}">×</button></div>`).join(''):`<div class="empty">${t('emptyLater')}</div>`);
  }else if(s==='parked'){
    body=S.parked.length?S.parked.map(x=>`<div class="srow"><span>${esc(x.text)}</span><button class="btn" data-act="parkLater" data-id="${x.id}">${t('toLater')}</button><button class="x" data-act="parkDel" data-id="${x.id}">×</button></div>`).join('')+`<div style="padding-top:12px"><button class="btn" data-act="parkClear">${t('clearAll')}</button></div>`:`<div class="empty">${t('emptyParked')}</div>`;
  }else if(s==='routines'){
    body=(S.routines.length?S.routines.slice().sort((a,b)=>BLOCKS.indexOf(a.block)-BLOCKS.indexOf(b.block)||(a.ord||0)-(b.ord||0)).map(r=>`<div class="srow"><small>${GL[r.block]}</small><span>${esc(r.text)}</span><button class="x" data-act="rtDel" data-id="${r.id}">×</button></div>`).join(''):`<div class="empty">${t('emptyRt')}</div>`)+
     `<form class="addf" data-form="routine" style="margin-top:12px"><input type="text" name="text" placeholder="${t('addPh')}" maxlength="120" required autocomplete="off"><div class="addrow"><select name="block">${BLOCKS.map(b=>`<option value="${b}">${lbl(b)}</option>`).join('')}</select><button class="btn primary">${t('addRt')}</button></div></form>`;
  }else if(s==='settings'){
    /* @map:settings — cap, block start hours, default timer, chime, export/import */
    const sel=(k,arr,v,fmt=x=>x)=>`<select data-set="${k}">${arr.map(x=>`<option value="${x}" ${x==v?'selected':''}>${fmt(x)}</option>`).join('')}</select>`;
    const rng=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
    body=`<div class="set">
      <label>${t('cap')}</label>${sel('cap',[2,3,4],S.cap)}
      <label>${GL.morning} · ${t('hours')}</label>${sel('h0',rng(3,10),S.hours[0],x=>pad(x)+':00')}
      <label>${GL.afternoon} · ${t('hours')}</label>${sel('h1',rng(11,15),S.hours[1],x=>pad(x)+':00')}
      <label>${GL.evening} · ${t('hours')}</label>${sel('h2',rng(16,21),S.hours[2],x=>pad(x)+':00')}
      <label>${t('timer')}</label>${sel('timer',[5,10,15,25],S.timer)}
      <label>${t('chime')}</label><input type="checkbox" data-set="chime" ${S.chime?'checked':''}>
    </div><div class="btnrow" style="margin-top:16px"><button class="btn" data-act="export">${t('exp')}</button><button class="btn" data-act="import">${t('imp')}</button></div>`;
  }
  el.innerHTML=`<div class="roller"></div><h3><span>${title}</span><button class="ib" data-act="closeSheet" aria-label="${t('close')}">×</button></h3><div class="sbody">${body}</div>`;
}

/* @map:render-all — single entry point; call after ANY state change. Typing in Now-card fields does NOT re-render (see actions-input). */
function render(){document.documentElement.lang=S.lang==='zh'?'zh-Hant':'en';document.documentElement.dataset.theme=S.theme;renderHead();renderMain();renderChips();renderSheet();}
