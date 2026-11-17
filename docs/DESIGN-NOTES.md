# DESIGN-NOTES — why the app works this way

Context: personal tool for an adult with ADHD who abandons a to-do list once it reaches ~5 pending items. The UI rules below come from a research pass (Nov 2026). Evidence quality differs; it is labelled.

| Rule in the app | Reason | Evidence |
|---|---|---|
| Only the **current block** is shown; other blocks are dots / peek | Long visible lists cause overwhelm and abandonment; list becomes a "ledger of failure" | Practitioner sources (moderate) |
| **Cap of 3** pending per block, overflow → hidden **Later** | User's own threshold is 5; stay below it | User report + practitioner advice |
| **Now card**: one task, smallest first step | Initiation and working-memory deficits; treatment must act at the *point of performance* | Barkley's executive-function model (strong, theory) |
| **If–then cue** field ("When…, I will…") | Implementation intentions improve goal attainment, incl. clinical samples (d+≈0.99) and children with ADHD | Meta-analyses + small ADHD studies (strong, mostly child data) |
| **Parking lot** (key P) + **resume note** | Interruptions decay the suspended goal; a ready-to-resume plan helps return | Cognitive-psychology literature (moderate) |
| **Visible time**: brush bar, timer | Time blindness; internal time cues unreliable | Barkley + reviews (moderate) |
| **No overdue, no streaks, silent rollover** | Shame worsens executive function and ends the next attempt | Practitioner sources (weak–moderate) |
| **No notifications, chime off by default** | Predictable reminders get filtered out (notification fatigue) | Anecdotal (weak) — plausible, not trial-backed |
| Seal stamp with **random glyph**, 3 themes | Novelty sustains an interest-based motivation system | Practitioner framework (Dodson) (weak) |

Not evidence-based claims to avoid repeating: "23 minutes to refocus" (untraceable); "object permanence" is slang — the real construct is prospective memory.
A to-do app is a prosthetic, not a treatment. Strongest treatment evidence: medication and CBT for adult ADHD (time-management / planning skills).

## Visual language (revised after UI/UX review)
宣紙 (xuan paper) beige, one 卷軸 scroll shell (two quiet wooden rods; sheets unroll like a second scroll), vermilion accents. Identifiers are one glyph (晨 午 夜 後 念 常) and **fill their tile** (iOS-icon style); counts are red badges.
- **Two typefaces on purpose.** DailyBrush (Bakudai Bold subset, OFL) is used only for glyphs/titles >= 26px (`@map:css-brush`), at weight 400 and without text-stroke. All running text, captions, inputs and buttons use the system UI font: a brush face is not legible at 14-18px.
- **No bold (T017).** Every element uses font-weight 400 (`*{font-weight:400}` in css/10-layout.css also resets UA bold on b, strong, h1–h6, th). Hierarchy comes from size and colour, not weight.
- **Background and palette restored (T017).** The owner preferred the 13ff8a7 look, so the paper, grain + fibre lines, edge shading, wooden rods, ink-wash art (sun, mountains, mist, birds) and the 13ff8a7 colour values are back. Only text tokens that failed 4.5:1 were moved in-hue (see comment in css/00-theme.css). The a2c724c button layout (large glyph tiles, SVG icons) stays.
- **Quiet rods (T018).** The rods are a frame, not ink. They sit flush with the paper edge at full paper width and are lit from the top (`--rodhi` → `--rod`). The top rod is a flat 8px 天杆 without caps (also each sheet's top); the bottom rod is a 12px 地軸 with small caps inside the paper. One soft shadow; lighter paper shading near the rods. `tools/contrast.py` checks: paper/warm rod colours <= 6:1 on paper; night rod >= 1.8:1 and the top edge is the brightest stripe. Source: design critique UI_CRITIQUE_rods_2026-11-17 (R1–R8).
- **Rejected: "Habit Tracker" style** (streaks, gamification) — conflicts with the no-overdue / no-streak / no-guilt rule above. ADHD rules are unchanged.
- **Accessibility:** text >= 4.5:1 in all three themes (`python3 tools/contrast.py`, currently ALL PASS), body >= 16px, captions >= 12-13px, `:focus-visible` ring, SVG icons instead of text glyphs, tab dots by shape (hollow = pending, solid = done) not colour alone, `prefers-reduced-motion` honoured. Buttons are smaller (34px, icon buttons 30px) with larger labels; every hit area stays >= 30px.
- Review method: the ui-ux-pro-max-skill CSV catalogues (MIT) were read as data only; none of its scripts were run.

## Key sources
- Barkley / CHADD executive function: https://chadd.org/about-adhd/executive-function-skills
- Implementation intentions in clinical samples (Toli, Webb & Hardy): https://eprints.whiterose.ac.uk/id/eprint/94825/3/WRRO_94825.pdf
- If–then plans in children with ADHD (Gawrilow et al.): https://www.socmot.uni-konstanz.de/sites/default/files/Gawrilow_Gollwitzer_Oettingen_Executive_Function_JSCP_2011.pdf
- Meta-cognitive therapy RCT, adults (Solanto et al.): https://psychiatryonline.org/doi/abs/10.1176/appi.ajp.2009.09081123
- CBT for adult ADHD meta-analysis: https://core.ac.uk/download/76998057.pdf
- Interruption resumption costs: https://arxiv.org/pdf/1806.06771
- Body doubling overview: https://www.simplypsychology.org/adhd-body-doubling.html
