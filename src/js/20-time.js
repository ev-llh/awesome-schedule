/* @map:time-blocks — which block is "now"; day boundary = morning start hour (so 1am still belongs to yesterday's 夜) */
const hrs=(d=new Date())=>d.getHours()+d.getMinutes()/60+d.getSeconds()/3600;
const pad=n=>String(n).padStart(2,'0');
function dayKey(d=new Date()){const x=new Date(d.getTime()-S.hours[0]*3600000);return x.getFullYear()+'-'+(x.getMonth()+1)+'-'+x.getDate();}
function curIdx(){const h=hrs(),[m,a,e]=S.hours;return h>=e?2:h>=a?1:h>=m?0:2;}

/* @map:block-progress — fraction of the current block elapsed + minutes left (drives the brush bar under the tabs) */
function progress(){
  const i=curIdx(),[m,a,e]=S.hours;let h=hrs();if(i===2&&h<m)h+=24;
  const w=i===0?[m,a]:i===1?[a,e]:[e,24+m];
  return {i,p:Math.min(1,Math.max(0,(h-w[0])/(w[1]-w[0]))),left:Math.max(0,(w[1]-h)*60)};
}
function leftText(min){
  min=Math.round(min);const h=Math.floor(min/60),m=min%60;
  return S.lang==='zh'?`${t('left')} ${h?h+'時':''}${m}分`:`${h?h+'h ':''}${m}m ${t('left')}`;
}
const fmtTimer=ms=>{const s=Math.ceil(ms/1000);return pad(Math.floor(s/60))+':'+pad(s%60);};
