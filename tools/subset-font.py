#!/usr/bin/env python3
"""Regenerate assets/fonts/dailybrush-subset.woff2 from the Bakudai (莫大毛筆) font (we ship the Bold weight: Regular is too thin to read at UI sizes).

Why: the full Regular WOFF2 is ~6.7 MB; we embed a subset so dist/daily-brush.html stays one offline file.
Licence: Bakudai is SIL OFL 1.1 with Reserved Font Name "Bakudai". A subset is a Modified Version, so the
         family name is rewritten to "DailyBrush" and the copyright + licence name records are kept.

Usage (run from the repo root, outside the font checkout):
  pip install fonttools brotli
  git clone --depth 1 https://github.com/max32002/bakudaifont /tmp/bakudaifont
  python3 -I tools/subset-font.py --ttf /tmp/bakudaifont/tw/Bakudai-Bold.ttf --style Bold [--level2] [-v]

Coverage = ASCII + Big5 punctuation + Big5 level-1 (~5.4k common Traditional chars)
         + every non-ASCII character found in src/ (so all UI text is always covered).
Characters outside this set (rare / Simplified / emoji) fall back to the next font in --serif.
"""
import argparse, pathlib
from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
FAMILY = "DailyBrush"

def big5_chars(level2):
    rows = list(range(0xA1, 0xC7)) + (list(range(0xC9, 0xFA)) if level2 else [])
    out = set()
    for hi in rows:
        for lo in list(range(0x40, 0x7F)) + list(range(0xA1, 0xFF)):
            try:
                s = bytes([hi, lo]).decode("big5")
            except UnicodeDecodeError:
                continue
            if len(s) == 1:
                out.add(s)
    return out

def src_chars():
    out = set()
    for p in (ROOT / "src").rglob("*"):
        if p.is_file() and p.suffix in {".js", ".css", ".html", ".svg"}:
            out |= {c for c in p.read_text(encoding="utf-8") if ord(c) > 127}
    return out

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ttf", required=True)
    ap.add_argument("--out", default=str(ROOT / "assets/fonts/dailybrush-subset.woff2"))
    ap.add_argument("--style", default="Bold", help="Regular | Medium | Bold (must match the --ttf weight)")
    ap.add_argument("--level2", action="store_true", help="also include Big5 level-2 (~7.6k rarer chars, bigger file)")
    ap.add_argument("-v", "--verbose", action="store_true")
    a = ap.parse_args()

    # ASCII is excluded on purpose: the @font-face is CJK-only (unicode-range), Latin uses the system UI font.
    chars = big5_chars(a.level2) | {c for c in src_chars() if ord(c) > 0xFF}
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.name_IDs = ["*"]
    opts.name_languages = ["*"]
    opts.hinting = False
    opts.notdef_outline = True
    opts.drop_tables += ["DSIG"]
    font = TTFont(a.ttf)
    sub = subset.Subsetter(opts)
    sub.populate(unicodes={ord(c) for c in chars})
    sub.subset(font)

    # OFL §3: a Modified Version must not use the Reserved Font Name as its primary font name.
    names = {1: FAMILY, 16: FAMILY, 2: a.style, 17: a.style, 3: FAMILY + "-" + a.style + "-subset",
             4: FAMILY + " " + a.style, 6: FAMILY + "-" + a.style}
    for rec in font["name"].names:
        if rec.nameID in names:
            rec.string = names[rec.nameID]
    font.flavor = "woff2"
    font.save(a.out)
    size = pathlib.Path(a.out).stat().st_size
    print(f"wrote {a.out}  glyphs={len(font.getGlyphOrder())}  size={size/1024:.0f} KiB")
    if a.verbose:
        for rec in font["name"].names:
            print(rec.nameID, str(rec)[:90].replace("\n", " "))

if __name__ == "__main__":
    main()
