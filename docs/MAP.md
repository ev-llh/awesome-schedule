# MAP — read this first (≈2 min), then open only what it points to

Daily Brush 日課: a one-file, offline, ADHD-friendly to-do panel (晨 午 夜 blocks, ink-wash + scroll look).
Vanilla JS/CSS, no dependencies. **Edit `src/`, never `dist/`.**

## 0. How to work in this repo (for LLMs and humans)
1. Read this file only. Find your task in §3 or §4.
2. Jump with `rg "@map:<tag>" src` — every anchor is a comment at the top of the relevant code. Read that block, not the whole file.
3. Change code → if you add/rename/remove an `@map:` anchor, update §3 here. `node tools/check-map.mjs` fails if code and map disagree.
4. Finish with `node tools/build.mjs` (rebuilds `dist/daily-brush.html`) and `python3 tests/smoke.py` if you touched behaviour.

## 1. Files
```
docs/MAP.md              this file (index, glossary, invariants)
docs/DESIGN-NOTES.md     WHY the UI works this way (ADHD research summary + sources) — read before changing rules like the 3-item cap
src/index.template.html  DOM skeleton with {{FONT_FACE}} {{CSS}} {{ART}} {{JS}} placeholders
src/art.svg              ink-wash mountains/sun backdrop
src/css/00-theme.css     colour tokens, 3 themes, font stack
src/css/10-layout.css    scroll shell, rollers, sheet unroll
src/css/20-components.css header, tabs, Now card, rows, footer, toast/stamp
src/js/  (concatenated in filename order into one IIFE — files share scope)
  00-i18n.js  05-util.js  10-state.js  20-time.js  30-items.js  40-render.js  50-actions.js  90-main.js
assets/fonts/            dailybrush-subset.woff2 (renamed OFL subset), LICENSE-OFL-1.1.txt, README.md
tools/build.mjs          src → dist (node, no deps)      tools/check-map.mjs  anchors ⇄ this file
tools/subset-font.py     regenerate the font subset      tests/smoke.py       headless-Chrome behaviour test
dist/daily-brush.html    GENERATED single file users open
```

## 2. Data model (`S`, persisted in localStorage key `dailybrush.v1`) → anchor `@map:state`
`routines[]` `{id:'r…',text,block,ord,step?,cue?,note?}` · `tasks[]` `{id:'t…',text,block|'later',ord,done,step?,cue?,note?}` ·
`parked[]` `{id,text,ts}` · `routineDone{id:dayKey}` · `day` (dayKey) · `cap` (2–4, default 3) · `hours[3]` (block start hours, default 5/12/18) ·
`timer` (min) · `run` `{id,end,total,fin}` | null · `nowId` · `theme` paper|night|warm · `lang` en|zh · `chime` · `seeded`.
Transient (not saved): `ui` = `{view, sheet, addOpen, focusAdd, lastIdx}`. `block` ∈ `morning|afternoon|evening|later`.

## 3. Feature → where (use `rg "@map:<tag>" src`)
| I want to change… | tag(s) | file |
|---|---|---|
| any user-visible text / add a language | `@map:i18n` | js/00-i18n.js |
| labels 晨午夜後念常 (one-glyph rule) | `@map:label-policy` | js/00-i18n.js |
| DOM helpers `$`, `esc` | `@map:util` | js/05-util.js |
| SVG icons `ic('check')` (sprite in index.template.html) | `@map:icons` | js/05-util.js |
| saved state shape, storage key, `ui` | `@map:state` | js/10-state.js |
| first-run example routines | `@map:seed-routines` | js/10-state.js |
| which block is "now", day boundary | `@map:time-blocks` | js/20-time.js |
| brush progress bar / "time left" text | `@map:block-progress` | js/20-time.js |
| tasks vs routines, done state, ordering | `@map:items` | js/30-items.js |
| the 3-item cap, overflow → Later | `@map:capacity-cap` | js/30-items.js |
| daily reset, passed-block sweep to Later | `@map:rollover` | js/30-items.js |
| tick a task, advance Now, stamp | `@map:complete` | js/30-items.js |
| toast message | `@map:toast` | js/40-render.js |
| red completion seal | `@map:stamp` | js/40-render.js |
| timer-end tone | `@map:chime` | js/40-render.js |
| title, clock, buttons, block tabs, progress | `@map:render-head` | js/40-render.js |
| one task row | `@map:render-rows` | js/40-render.js |
| Now card (step / if-then / resume / timer UI) | `@map:render-now-card` | js/40-render.js |
| current-block list, peek banner, empty state | `@map:render-main` | js/40-render.js |
| "+ add" form | `@map:render-add-form` | js/40-render.js |
| footer chips 後 念 常 | `@map:render-chips` | js/40-render.js |
| unrolled sheets (Later/Parked/Routines/Settings) | `@map:render-sheet` | js/40-render.js |
| settings rows (cap, hours, timer, chime, backup) | `@map:settings` | js/40-render.js |
| full re-render entry point | `@map:render-all` | js/40-render.js |
| any button behaviour (`data-act`) | `@map:actions-click` | js/50-actions.js |
| theme cycling | `@map:theme-switch` | js/50-actions.js |
| pop-out window button | `@map:popout` | js/50-actions.js |
| start/stop/+5 timer | `@map:timer` | js/50-actions.js |
| JSON export / import | `@map:export-import` | js/50-actions.js |
| park / add / routine form submit | `@map:actions-forms` | js/50-actions.js |
| typing in Now-card fields, settings change | `@map:actions-input` | js/50-actions.js |
| keyboard shortcuts (P, N, Esc) | `@map:actions-keys` | js/50-actions.js |
| per-second loop, block auto-switch, timer finish | `@map:tick` | js/90-main.js |
| startup order | `@map:boot` | js/90-main.js |
| DOM skeleton | `@map:html-shell` | index.template.html |
| backdrop art | `@map:art-svg` · `@map:css-art` | art.svg · css/10-layout.css |
| font stack / where @font-face comes from (CJK-only `unicode-range`) | `@map:css-fonts` | css/00-theme.css (+ tools/build.mjs) |
| colours / themes | `@map:css-theme` | css/00-theme.css |
| scroll paper (grain, fibres, edge shading) | `@map:css-scroll` | css/10-layout.css |
| wooden rods (gradient bar + 2 end caps) | `@map:css-roller` | css/10-layout.css |
| focus ring | `@map:css-focus` | css/10-layout.css |
| brush-glyph style (.gl: weight 400, big glyphs only) | `@map:css-brush` | css/20-components.css |
| sheet unroll animation | `@map:css-sheet-unroll` | css/10-layout.css |
| header look | `@map:css-header` | css/20-components.css |
| block tabs + dots | `@map:css-tabs` | css/20-components.css |
| Now card look, timer bar | `@map:css-now-card` | css/20-components.css |
| rows, empty state, add form | `@map:css-rows` | css/20-components.css |
| footer input + chips | `@map:css-footer` | css/20-components.css |
| sheet inner lists / settings grid | `@map:css-sheet-content` | css/20-components.css |
| toast + stamp styling/animation | `@map:css-toast-stamp` | css/20-components.css |

## 4. Symptom → first place to look
| Symptom | Look at |
|---|---|
| Label shown twice in zh (e.g. 後 後) | `@map:label-policy` → use `lbl()` / `GL`, never glyph + zh word |
| Block shows more than 3 items | `@map:capacity-cap` (`addTask`, `laterHere`, routine add in `@map:actions-forms`) |
| Task vanished overnight | `@map:rollover` (done one-offs are dropped by design; undone → Later) |
| Wrong block active / wrong "day" | `@map:time-blocks` (`dayKey` rolls at morning-start hour) |
| Typing in a field loses focus | something calls `render()` during typing → see `@map:actions-input` |
| Timer wrong after reload | `S.run` is stored as absolute `end` ms; see `@map:timer`, `@map:tick` |
| Latin text looks wide/loose | brush font must stay CJK-only: `unicode-range` in tools/build.mjs |
| Font not applied / tofu boxes | `@map:css-fonts`, `assets/fonts/README.md` (subset coverage), rebuild |
| Scroll rods/edges look off | `@map:css-roller`, `@map:css-scroll` (13ff8a7 wood + paper look, colours from `@map:css-theme`) |
| Sheet won't open/close | `@map:css-sheet-unroll` + `@map:render-sheet` (`.open` class) |
| Data lost between sessions | localStorage is per browser + file path; `@map:export-import` |
| New string untranslated | `@map:i18n` — add key to BOTH `en` and `zh` |

## 5. Glossary
- **Block / 時辰** — one of 晨 morning, 午 afternoon, 夜 evening (+ hidden bucket 後 Later). Hours in `S.hours`.
- **Now / 當下** — the single highlighted pending item of the current block (`nowItem`, `S.nowId`).
- **Cap** — max pending items per block (`S.cap`, default 3). Exists because the user abandons lists at ≥5 (see DESIGN-NOTES).
- **Later / 後** — hidden overflow bucket (`block:'later'`). Out of sight, not deleted.
- **Parked / 念** — inbox for stray thoughts captured with key **P**; never counts toward the cap.
- **Routine / 常 (tag 日)** — daily repeating item (`id` starts `r`); done-ness is `routineDone[id]===S.day`.
- **Task / one-off** — single-day item (`id` starts `t`).
- **Rollover** — new-day reset and silent sweep of passed blocks (`rollover()`).
- **Day key** — date string shifted by morning-start hour so 1 am still belongs to yesterday's 夜.
- **Peek / 窺** — viewing a non-current block (list only, no Now card).
- **Stamp / 印** — red seal shown on completion (random glyph from `STAMPS`).
- **Scroll / 卷軸, Roller / 軸** — the paper shell with wooden rods; sheets "unroll" as a second scroll.
- **Themes** — 宣紙 `paper` (xuan-paper beige, default), 墨夜 `night`, 暖 `warm` (cork & coffee).
- **One-glyph rule** — zh identifiers are a single character (晨 not 早晨); en shows glyph + word.
- **DailyBrush** — renamed subset of the Bakudai (莫大毛筆) font; OFL 1.1.
- **First step / If–then cue / Resume note** — fields on the Now card (`step`, `cue`, `note`).

## 6. Invariants — don't break
- Single self-contained output file, works offline from `file://`; no network calls, no external fonts/CDNs.
- All persisted data is in `S`; every mutation ends with `save()` then `render()` (except typing, see `@map:actions-input`).
- Never render user text unescaped — use `esc()`.
- Pending items per block ≤ `S.cap` (routines count via `staticLoad`).
- No guilt UI: no red overdue, no streak counters, no repeating notifications.
- Font: keep the family name `DailyBrush` (OFL Reserved Font Name "Bakudai" must not be used) and ship `assets/fonts/LICENSE-OFL-1.1.txt`.
- Public repo: no personal data, tokens, backups (`*backup*.json` is git-ignored), or personal e-mail in commits.

## 7. Commands
```
node tools/build.mjs          # build dist/daily-brush.html
node tools/check-map.mjs      # verify anchors ⇄ this file
python3 tests/smoke.py        # needs: pip install playwright (+ a Chrome/Chromium); set CHROME_PATH if needed
python3 -I tools/subset-font.py --ttf <Bakudai-Bold.ttf> --style Bold   # regenerate font subset
python3 tools/contrast.py                                        # WCAG audit of theme tokens (must be ALL PASS)
```
