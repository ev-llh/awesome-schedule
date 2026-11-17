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

## Visual language
宣紙 (xuan paper) beige, ink-wash mountains, vermilion seal accents, a 卷軸 scroll shell (wooden rods; sheets unroll like a second scroll). Identifiers are one glyph (晨 午 夜 後 念 常). Font: DailyBrush (Bakudai subset, OFL).

## Key sources
- Barkley / CHADD executive function: https://chadd.org/about-adhd/executive-function-skills
- Implementation intentions in clinical samples (Toli, Webb & Hardy): https://eprints.whiterose.ac.uk/id/eprint/94825/3/WRRO_94825.pdf
- If–then plans in children with ADHD (Gawrilow et al.): https://www.socmot.uni-konstanz.de/sites/default/files/Gawrilow_Gollwitzer_Oettingen_Executive_Function_JSCP_2011.pdf
- Meta-cognitive therapy RCT, adults (Solanto et al.): https://psychiatryonline.org/doi/abs/10.1176/appi.ajp.2009.09081123
- CBT for adult ADHD meta-analysis: https://core.ac.uk/download/76998057.pdf
- Interruption resumption costs: https://arxiv.org/pdf/1806.06771
- Body doubling overview: https://www.simplypsychology.org/adhd-body-doubling.html
