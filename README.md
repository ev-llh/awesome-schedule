# awesome-schedule · 日課 Daily Brush

A one-file, offline to-do panel for people who stall on long lists. Morning / afternoon / evening (晨 午 夜), only the current block visible, at most 3 items each, one **Now** card with a first step and a timer, a one-key parking lot for stray thoughts, no overdue guilt. Ink-wash on xuan paper, in a scroll.

**Use it:** download [`dist/daily-brush.html`](dist/daily-brush.html) and open it (best in a narrow window, ~¼ of the screen):

```
# Windows
chrome --app="file:///C:/path/daily-brush.html" --window-size=480,1000 --window-position=1440,0
# macOS
open -na "Google Chrome" --args --app="file:///path/daily-brush.html" --window-size=480,1000
```

Keys: **P** park a thought · **N** new item · **Esc** close. Data stays in your browser (localStorage); use Settings → Export for backups.

**Develop:** `node tools/build.mjs` → `dist/daily-brush.html`. No dependencies.
**LLM agents / contributors:** start at [`docs/MAP.md`](docs/MAP.md) (index + glossary), see [`AGENTS.md`](AGENTS.md).
**Why it works this way:** [`docs/DESIGN-NOTES.md`](docs/DESIGN-NOTES.md).

Font: DailyBrush, a renamed subset of [Bakudai](https://github.com/max32002/bakudaifont) (SIL OFL 1.1) — see [`assets/fonts/README.md`](assets/fonts/README.md).
