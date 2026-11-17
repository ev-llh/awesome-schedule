/* @map:i18n — every user-visible string lives here (en + zh-Hant). Add a key to BOTH languages. */
const BLOCKS=['morning','afternoon','evening'];
const GL={morning:'晨',afternoon:'午',evening:'夜',later:'後',parked:'念',routines:'常'};
const STAMPS=['成','完','妙','好','善','穩','達'];
const THEMES=['paper','night','warm'];

const I18={
en:{today:'Today',sub:'今日',morning:'Morning',afternoon:'Afternoon',evening:'Evening',later:'Later',parked:'Parked',routines:'Routines',settings:'Settings',set:'Set',
 now:'Now',firstStep:'Smallest first step',firstStepPh:'e.g. open the file',cue:'If–then',cuePh:'When ___ , I will ___',resume:'Resume here',resumePh:'Where I stopped / next move',
 start:'Start',min:'min',stop:'Stop',done:'Done',notNow:'Not now',add:'+ Add',addGo:'Add',addPh:'What needs doing?',every:'Every day',blockClear:'This block is clear. Rest.',
 peek:'Peeking at',back:'Back to now',parkPh:'Stray thought? Park it here · press P',parkedToast:'Parked. Back to:',fullToast:'Block is full — sent to Later.',left:'left',
 here:'→ here',emptyLater:'Nothing waiting.',emptyParked:'Nothing parked.',emptyRt:'No routines yet.',clearAll:'Clear all',toLater:'→ Later',cap:'Max items per block',
 hours:'Block starts',timer:'Default timer (min)',chime:'Soft chime when time is up',exp:'Export backup',imp:'Import',time:'Time!',plus5:'+5',
 routineFull:'That block already has the max routines.',moved:'Moved to this block.',noRoom:'No room in this block.',close:'Close',addRt:'Add routine',ok:'Imported.',bad:'Could not read that file.',
 laterNote:'Hidden on purpose — out of sight, not forgotten.',popout:'Pop out',theme:'Theme'},
zh:{today:'今日',sub:'',morning:'晨',afternoon:'午',evening:'夜',later:'後',parked:'念',routines:'常',settings:'設定',set:'設',
 now:'當下',firstStep:'最小的第一步',firstStepPh:'例如：打開檔案',cue:'若…則…',cuePh:'當我＿＿，我就＿＿',resume:'停在這裡',resumePh:'做到哪裡／下一步',
 start:'開始',min:'分',stop:'停止',done:'完成',notNow:'先放一放',add:'＋ 添一項',addGo:'添',addPh:'要做什麼？',every:'每日',blockClear:'此時辰已清空，歇一歇。',
 peek:'窺看：',back:'回到當下',parkPh:'雜念先記下 · 按 P 快速輸入',parkedToast:'已記下。回到：',fullToast:'此時辰已滿，已放入「後」。',left:'餘',
 here:'→ 放這裡',emptyLater:'沒有等待中的事。',emptyParked:'沒有記下的念頭。',emptyRt:'尚無日常。',clearAll:'全部清除',toLater:'→ 後',cap:'每時辰上限',
 hours:'起點',timer:'預設計時（分）',chime:'時間到輕聲提示',exp:'匯出備份',imp:'匯入',time:'時間到',plus5:'+5',
 routineFull:'此時辰的日常已達上限。',moved:'已移到此時辰。',noRoom:'此時辰已無空位。',close:'關閉',addRt:'新增日常',ok:'已匯入。',bad:'無法讀取該檔案。',
 laterNote:'刻意收起來——不在眼前，但沒有忘記。',popout:'獨立視窗',theme:'主題'}
};
const t=k=>{const d=I18[S.lang];return (d&&k in d)?d[k]:(I18.en[k]??k);};   // '' is a valid translation (no fallback)

/* @map:label-policy — identifiers are ONE glyph in zh (晨 午 夜 後 念 常); in en: glyph + English word.
   Never print glyph + zh word (that produced "後 後", "念 念頭", "常 日常"). Use lbl() for any block/bucket label. */
const lbl=k=>S.lang==='zh'?GL[k]:GL[k]+' '+t(k);
