# Overflow verdict — jorgevs.com mobile, branch `fix/mobile-nav-text-overlap`

Question: is the left-edge cutoff in `screenshots/01-nav-scrolled-into-view.png`
(heading "OMPOSITION NOTES") a real horizontal overflow, or a capture artifact?

**Verdict: no real horizontal overflow. The cutoff is a capture artifact of Safari's
find-and-scroll (`:~:text=` fragment), which offsets the visual viewport without a
layout overflow. No CSS change made.**

## Real iOS Safari 18.3.1 (simulator WEB-IPHONE, iPhone 16 Pro), same-origin iframe probe

Page: `http://localhost:8080/__overflow_probe.html?w=390` → iframe 390 px wide, real
`index.html` + `main-v3-clean.css`, real `content-manager.js` nav build.
Screenshot: `probe/ios-probe-390-real-safari.png` (text rendered by Mobile Safari).

```
serverNav {"inner":390,"scrollW":390,"OVERFLOW":0,"items":4,"navSum":311,"navBox":369,
          "itemW":[71,82,92,66],"worst":"DIV.profile-decoration +19px"}
REALNAV   {"inner":390,"scrollW":390,"OVERFLOW":0,"items":7,"navSum":301,"navBox":369,
          "itemW":[38,48,48,59,32,32,43],"worst":"none"}
```

`REALNAV` = the 7 items production actually serves (live `/content-index/` =
about, catalog, contact, etc, img, listen, **privacy hidden** (`<!-- nav: oculto -->`),
subscribe), injected because `dev-server.js` has no `/content-index/` route.
Item widths on iOS are byte-identical to Chromium (Andale Mono/Monaco absent on iOS →
Courier New, same 0.6 em advance), so the two engines agree.

## Chromium sweep, 7-item real nav vs 4-item local fallback (`probe/chromium-sweep.txt`)

```
nav       w items  inner  scrollW  over  navSum maxScrollX
real    320     7    320      320     0     235          0
real    360     7    360      360     0     280          0
real    375     7    375      375     0     287          0
real    390     7    390      390     0     301          0
real    393     7    393      393     0     304          0
real    402     7    402      402     0     313          0
real    414     7    414      414     0     324          0
real    428     7    428      428     0     337          0
real    768     7    768      768     0    1124          0
local   ... (4 items, all widths)                           0
```

`maxScrollX` = `window.scrollTo(9999,0)` → still 0 at every width: the document cannot
scroll horizontally, so no layout-driven left cutoff is possible.

## Font bound at 390 px (`--font-mono` forced)

```
'Andale Mono' / 'Monaco' / 'Courier New' / 'Courier' / monospace
  → item width 37.8 px, navSum 301.3, inner 390, scrollW 390, over 0
```

All mono candidates give identical metrics; nav uses 301 of 369 px available (18 % slack).

## Latent (not triggered): 8 labels at 390 px

```
{'labels': 8, 'navScrollW': 372, 'navClientW': 369, 'sum': 326,
 'docScrollW': 390, 'inner': 390, 'OVERFLOW': 0}
```

Even re-enabling the hidden "Privacy Policy" item leaves document overflow at 0; the row
itself clips 3 px inside the nav box, so the page-wide overflow the original report
predicted does not occur.

## Why the screenshot looked shifted

The capture was taken after an iOS Safari `:~:text=` navigation. On iOS, `window.scrollX`
reports the visual-viewport offset, which is not clamped to the layout scroll range — in
the probe, `scrollTo(9999,0)` inside the iframe returned `scrollX = 9999` while
`scrollWidth` stayed 390. A visual-viewport offset with zero layout overflow renders
exactly the observed symptom (uniformly shifted content, line breaks unchanged, so no
reflow), and is not a CSS bug.
