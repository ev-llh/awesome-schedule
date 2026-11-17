/* @map:tick — runs every second: clock, block auto-switch + rollover, progress bar, timer countdown/finish */
function tick(){
  const d=new Date();
  const ck=$('#clock');if(ck)ck.textContent=pad(d.getHours())+':'+pad(d.getMinutes());
  const dk=dayKey(),ci=curIdx();
  if(S.day!==dk||ci!==ui.lastIdx){
    const wasCurrent=ui.view===ui.lastIdx||ui.lastIdx<0;
    rollover();ui.lastIdx=ci;if(wasCurrent)ui.view=ci;render();return;
  }
  const pr=progress(),bl=$('#bleft'),bp=$('#bprog');
  if(bl)bl.textContent=leftText(pr.left);
  if(bp)bp.style.width=Math.round(pr.p*100)+'%';
  if(S.run){
    const left=S.run.end-Date.now();
    if(left<=0){
      if(!S.run.fin){S.run.fin=true;save();document.title='⏰ '+t('time');chime();render();}
    }else{
      const tm=$('#tmr'),tb=$('#tbar');
      if(tm)tm.textContent=fmtTimer(left);
      if(tb)tb.style.width=Math.min(100,Math.round((1-left/S.run.total)*100))+'%';
    }
  }
}

/* @map:boot — startup order */
rollover();
ui.lastIdx=curIdx();ui.view=ui.lastIdx;
render();
setInterval(tick,1000);
