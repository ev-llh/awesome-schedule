#!/usr/bin/env python3
"""WCAG contrast audit of the theme tokens in src/css/00-theme.css.
Run: python3 tools/contrast.py      Exit code 1 if any TEXT pair is below 4.5:1 (UI marks need >= 3:1).
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
UI = [("scroll rod vs paper (UI mark)", "rod", "bg"), ("button vs paper (UI mark)", "btn", "bg")]

def main():
    css = CSS.read_text(encoding="utf-8"); bad = 0
    for theme in ("paper", "night", "warm"):
        t = tokens(css, theme); print(f"\n== {theme}")
        for need, rows in ((4.5, TEXT), (3.0, UI)):
            for label, fg, bg in rows:
                r = ratio(rgb(t[fg]), rgb(t[bg])); ok = r >= need; bad += not ok
                print(f"  {'ok  ' if ok else 'FAIL'} {r:5.2f} (>= {need})  {label}")
    print("\nALL PASS" if not bad else f"\n{bad} FAILING PAIRS"); sys.exit(1 if bad else 0)

main()
