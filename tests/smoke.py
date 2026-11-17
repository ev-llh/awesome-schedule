#!/usr/bin/env python3
"""Headless-Chrome smoke test for dist/daily-brush.html.
Setup: pip install playwright   (+ Chrome/Chromium; set CHROME_PATH=/path/to/chrome if playwright's own browser is not installed)
Run:   python3 tests/smoke.py     Screenshots go to tests/shots/ (git-ignored).
"""
import asyncio, os, pathlib
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGE = (ROOT / "dist/daily-brush.html").as_uri()
SHOTS = ROOT / "tests/shots"; SHOTS.mkdir(exist_ok=True)

def check(cond, msg):
    print(("PASS " if cond else "FAIL ") + msg)
    if not cond: raise SystemExit(1)

async def main():
    async with async_playwright() as p:
        kw = {"executable_path": os.environ["CHROME_PATH"], "args": ["--no-sandbox"]} if os.environ.get("CHROME_PATH") else {}
        b = await p.chromium.launch(**kw)
        ctx = await b.new_context(viewport={"width": 460, "height": 880}, locale="en-AU", timezone_id="Australia/Sydney")
        page = await ctx.new_page()
        errs = []
        page.on("pageerror", lambda e: errs.append(str(e)))
        page.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
        await page.clock.install(time="2026-11-17T14:34:00+11:00")
        await page.goto(PAGE); await page.wait_for_timeout(400)
        await page.screenshot(path=str(SHOTS / "1_initial.png"))

        check(await page.evaluate("document.fonts.check('16px DailyBrush','晨午夜')"), "embedded font DailyBrush loads")

        # cap: 1 seeded routine + 2 tasks fit, 3rd overflows to Later
        for txt in ["Reply to landlord email", "Book dentist", "Submit expense report"]:
            await page.keyboard.press("n")
            await page.fill(".addf input[name=text]", txt)
            await page.select_option(".addf select[name=block]", "afternoon")
            await page.keyboard.press("Enter"); await page.wait_for_timeout(100)
        check("Later" in await page.inner_text("#toast"), "4th item overflows to Later (cap 3)")
        check(await page.locator(".row").count() + await page.locator(".now").count() == 3, "block shows exactly 3 items")

        # now card + timer
        await page.fill("input[data-f=step]", "Open Gmail")
        await page.click("[data-act=start]"); await page.clock.run_for(5000)
        await page.screenshot(path=str(SHOTS / "2_running.png"))
        check(":" in await page.inner_text("#tmr"), "timer counts down")

        # parking
        await page.keyboard.press("p"); await page.keyboard.type("check flight prices"); await page.keyboard.press("Enter")
        await page.wait_for_timeout(100)
        check("Parked" in await page.inner_text("#toast"), "P parks a thought")

        # complete
        await page.click(".now [data-act=toggle]"); await page.wait_for_timeout(250)
        check(await page.locator(".row.done").count() == 1, "completing marks row done")

        # sheet unroll
        await page.click("[data-s=later]"); await page.wait_for_timeout(600)
        await page.screenshot(path=str(SHOTS / "3_later_sheet.png"))
        check(await page.locator("#sheet.open").count() == 1, "Later sheet unrolls")
        await page.click("[data-act=closeSheet]"); await page.wait_for_timeout(500)

        # themes + zh label policy (no duplicated words)
        for i in range(3):
            await page.click("[data-act=theme]"); await page.wait_for_timeout(120)
            await page.screenshot(path=str(SHOTS / f"4_theme{i}.png"))
        await page.click("[data-act=lang]"); await page.wait_for_timeout(150)
        await page.screenshot(path=str(SHOTS / "5_zh.png"))
        chips = [(await c.inner_text()).strip() for c in await page.locator(".chip").all()]
        check(all(len(c.replace("\n", "").rstrip("0123456789")) == 1 for c in chips), f"zh chips are one glyph only: {chips}")
        tabs = [(await c.inner_text()).split("\n")[0].strip() for c in await page.locator(".tab").all()]
        check(tabs == ["晨", "午", "夜"], f"zh tabs are one glyph: {tabs}")
        await page.click("[data-act=lang]")

        # timer finish, reload persistence
        await page.click("[data-act=start]"); await page.clock.run_for(11 * 60 * 1000); await page.wait_for_timeout(150)
        check("Time" in await page.inner_text("#tmr"), "timer finishes")
        await page.reload(); await page.wait_for_timeout(300)
        check("1" in await page.inner_text("[data-s=parked]"), "state persists across reload")

        # block change + next day
        await page.clock.fast_forward(4 * 3600 * 1000); await page.wait_for_timeout(1500)
        check("夜" in await page.inner_text(".tab.on"), "auto-switches to evening")
        await page.clock.fast_forward(12 * 3600 * 1000); await page.wait_for_timeout(1500)
        check("晨" in await page.inner_text(".tab.on"), "next day starts at morning")

        check(not errs, f"no console/page errors {errs}")
        await b.close()

asyncio.run(main())
