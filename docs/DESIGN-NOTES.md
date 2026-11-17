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
宣紙 (xuan paper) beige, one flat 卷軸 scroll shell (two solid thin rods; sheets unroll like a second scroll), vermilion accents. Identifiers are one glyph (晨 午 夜 後 念 常) and **fill their tile** (iOS-icon style); counts are red badges.
- **Two typefaces on purpose.** DailyBrush (Bakudai **Bold** subset, OFL) + `-webkit-text-stroke:.045em` is used only for glyphs/titles >= 26px (`@map:css-brush`). All running text, captions, inputs and buttons use the system UI font: a brush face is not legible at 14-18px (tested Regular/Medium/Bold; Bold + stroke is the thickest that stays clean).
- **Flat, not skeuomorphic.** The 3D wooden rods were rejected: the review data lists Skeuomorphism as "not for web / low performance", Flat Design as a fit for productivity apps. Rods are now one solid bar + two flat knobs; no gradients, no shadows.
- **Less decoration** (excess decoration is a listed anti-pattern): birds, sun blur, fibre lines and edge shading removed; only two faint flat mountain layers + very light grain remain.
- **Rejected: "Habit Tracker" style** (streaks, gamification) — conflicts with the no-overdue / no-streak / no-guilt rule above. ADHD rules are unchanged.
- **Accessibility:** text >= 4.5:1 in all three themes (`python3 tools/contrast.py`, currently ALL PASS), body >= 16px, captions >= 12-13px, `:focus-visible` ring, SVG icons instead of text glyphs, tab dots by shape (hollow = pending, solid = done) not colour alone, `prefers-reduced-motion` honoured. Buttons are smaller (38px) but every hit area stays >= 30px.
- Review method: the ui-ux-pro-max-skill CSV catalogues (MIT) were read as data only; none of its scripts were run.

## Key sources
- Barkley / CHADD executive function: https://chadd.org/about-adhd/executive-function-skills
- Implementation intentions in clinical samples (Toli, Webb & Hardy): https://eprints.whiterose.ac.uk/id/eprint/94825/3/WRRO_94825.pdf
- If–then plans in children with ADHD (Gawrilow et al.): https://www.socmot.uni-konstanz.de/sites/default/files/Gawrilow_Gollwitzer_Oettingen_Executive_Function_JSCP_2011.pdf
- Meta-cognitive therapy RCT, adults (Solanto et al.): https://psychiatryonline.org/doi/abs/10.1176/appi.ajp.2009.09081123
- CBT for adult ADHD meta-analysis: https://core.ac.uk/download/76998057.pdf
- Interruption resumption costs: https://arxiv.org/pdf/1806.06771
- Body doubling overview: https://www.simplypsychology.org/adhd-body-doubling.html
