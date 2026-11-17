#!/usr/bin/env python3
"""WCAG contrast audit of the theme tokens in src/css/00-theme.css.
Run: python3 tools/contrast.py      Exit code 1 if any TEXT pair is below 4.5:1 (UI marks need >= 3:1) or a scroll-rod rule fails.
Design rule source: ui-ux-pro-max-skill 'Color Contrast' (4.5:1 normal text). See docs/DESIGN-REVIEW.md.
"""
import pathlib, re, sys

CSS = pathlib.Path(__file__).resolve().parent.parent / "src/css/00-theme.css"

def tokens(css, name):
    pat = r':root,\[data-theme="paper"\]\{(.*?)\}' if name == "paper" else r'\[data-theme="%s"\]\{(.*?)\}' % name
    return dict(re.findall(r"--([\w-]+):\s*([^;]+);", re.search(pat, css, re.S).group(1)))

def rgb(s):
    s = s.strip()
    m = re.fullmatch(r"#([0-9a-fA-F]{6})", s)
    if m: return tuple(int(m.group(1)[i:i+2], 16) for i in (0, 2, 4))
    m = re.fullmatch(r"rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)", s)
    return tuple(float(m.group(i)) for i in (1, 2, 3))

def lum(c):
    f = lambda v: v / 255 / 12.92 if v / 255 <= .03928 else ((v / 255 + .055) / 1.055) ** 2.4
    r, g, b = map(f, c); return .2126 * r + .7152 * g + .0722 * b

def ratio(a, b):
    la, lb = lum(a), lum(b); return (max(la, lb) + .05) / (min(la, lb) + .05)

TEXT = [  # (label, foreground token, background token)
    ("body text on paper", "ink", "bg"), ("body text on card", "ink", "card"), ("text on tile", "ink", "tile"),
    ("secondary text on card", "ink2", "card"), ("secondary text on paper", "ink2", "bg"),
    ("caption on card", "ink3", "card"), ("caption on paper", "ink3", "bg"), ("caption/placeholder on tile", "ink3", "tile"),
    ("link/number (red) on card", "red", "card"), ("link/number (red) on paper", "red", "bg"),
    ("primary button text", "btntext", "btn"),
    ("Now card text", "darktext", "dark"), ("Now card caption", "dt2", "dark"), ("Now card input text", "darktext", "field"),
    ("Now card placeholder", "ph", "field"), ("Now card caption on field", "dt2", "field"), ("gold (timer) on Now card", "gold", "dark"),
]
UI = [("button vs paper (UI mark)", "btn", "bg")]
# Scroll rods are a quiet frame, not ink (critique R1/R7, docs/DESIGN-NOTES.md). Gradient runs rodhi (top) -> rod; caps use cap.
ROD_MAX = 6.0  # light themes: no rod colour above 6:1 on --bg
ROD_MIN = {"paper": 3.0, "warm": 3.0, "night": 1.8}  # rod body must still read as an edge

def rods(theme, t):
    bad = 0; bg = rgb(t["bg"])
    def out(ok, r, label):
        print(f"  {'ok  ' if ok else 'FAIL'} {r:5.2f} {label}"); return not ok
    r = ratio(rgb(t["rod"]), bg); bad += out(r >= ROD_MIN[theme], r, f"(>= {ROD_MIN[theme]})  scroll rod body vs paper")
    if theme == "night":  # dark theme: the top light must be the brightest stripe (no floating highlight)
        top = lum(rgb(t["rodhi"])); ok = top >= lum(rgb(t["rod"])) and top >= lum(rgb(t["cap"]))
        bad += out(ok, ratio(rgb(t["rodhi"]), bg), "(brightest)  rod top edge is the brightest stripe")
    else:
        for k in ("rodhi", "rod", "cap"):
            r = ratio(rgb(t[k]), bg); bad += out(r <= ROD_MAX, r, f"(<= {ROD_MAX})  rod colour --{k} vs paper (frame, not ink)")
    return bad

def main():
    css = CSS.read_text(encoding="utf-8"); bad = 0
    for theme in ("paper", "night", "warm"):
        t = tokens(css, theme); print(f"\n== {theme}")
        for need, rows in ((4.5, TEXT), (3.0, UI)):
            for label, fg, bg in rows:
                r = ratio(rgb(t[fg]), rgb(t[bg])); ok = r >= need; bad += not ok
                print(f"  {'ok  ' if ok else 'FAIL'} {r:5.2f} (>= {need})  {label}")
        bad += rods(theme, t)
    print("\nALL PASS" if not bad else f"\n{bad} FAILING PAIRS"); sys.exit(1 if bad else 0)

main()
