/* @map:state — persisted state object S (localStorage key below), transient UI state `ui`, helpers */
const KEY='dailybrush.v1';
const DEF={routines:[],tasks:[],parked:[],day:'',cap:3,theme:'paper',lang:'en',hours:[5,12,18],timer:10,chime:false,nowId:null,run:null,routineDone:{},seeded:false};
let S=structuredClone(DEF);
try{const raw=localStorage.getItem(KEY); if(raw) Object.assign(S,JSON.parse(raw));}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
const uid=p=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const ui={view:0,sheet:null,addOpen:false,focusAdd:false,lastIdx:-1};   // not persisted

/* @map:seed-routines — three generic example routines on first run only */
if(!S.seeded && !S.routines.length && !S.tasks.length){
  const n=Date.now();
  S.routines.push({id:uid('r'),text:'Drink water, open today’s list',block:'morning',ord:n},
                  {id:uid('r'),text:'Stand up and stretch for 2 minutes',block:'afternoon',ord:n+1},
                  {id:uid('r'),text:'Tidy the desk, set tomorrow’s first step',block:'evening',ord:n+2});
  S.seeded=true; save();
}
