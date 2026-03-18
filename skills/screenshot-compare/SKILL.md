---
name: screenshot-compare
description: Invoke this skill when taking screenshots for visual verification, when comparing output against a reference image, when iterating on a section until it matches a design, or when the user asks to verify how something looks visually.
---

# Screenshot Compare Skill

## What This Skill Does
Automates visual verification of built sections and pages. Takes screenshots via Puppeteer, reads and analyzes the result, compares against reference images when available, and iterates until the output matches exactly or no visible differences remain.

---

## Tools Location
```
Desktop/Lup Vision/Website-uri/Flux de lucru/
├── serve.mjs        — local HTTP server (port 3000)
├── screenshot.mjs   — Puppeteer screenshot + optional diff
└── node_modules/    — puppeteer, pixelmatch, pngjs
```

Screenshots are saved to `./temporary screenshots/` inside the current project folder.

---

## Before Any Screenshot

Always verify the server is running. If not, start it first:
```bash
node "../../Flux de lucru/serve.mjs"
```

Never screenshot a `file:///` URL — fonts, JS, and some CSS will not load correctly.
Never start a second server instance if one is already running on port 3000.

---

## Varianta A — No Reference Image

Use when building from scratch without a design reference.

```bash
# Basic — full page, 1440px wide
node "../../Flux de lucru/screenshot.mjs" http://localhost:3000

# With label — saved as screenshot-N-label.png
node "../../Flux de lucru/screenshot.mjs" http://localhost:3000 hero

# With label and custom width — for mobile/tablet testing
node "../../Flux de lucru/screenshot.mjs" http://localhost:3000 hero 375
node "../../Flux de lucru/screenshot.mjs" http://localhost:3000 hero 1099
```

After saving, immediately read the PNG from `temporary screenshots/` and analyze it visually. Do not wait for the user to ask — analyze proactively.

### What to check in Varianta A:
- Spacing and padding match the 8px scale
- Typography: size, weight, line-height, letter-spacing look correct
- Colors match the project palette — no default colors
- Alignment is consistent across elements
- No overflow, no clipping, no unexpected scrollbars
- Hover states visible (check via JS if needed)
- Animations played correctly (800ms wait is built into the script)

---

## Varianta B — With Reference Image

Use when the user provides a reference screenshot from Chrome DevTools (F12 → CMD+Shift+P → "Capture full size screenshot").

```bash
# Reference image must be in the project folder or provide full path
node "../../Flux de lucru/screenshot.mjs" http://localhost:3000 label 1440 referinta.png
```

This saves two files:
- `screenshot-N-label.png` — the current output
- `diff-N-label.png` — pixel diff overlay

### Reading the diff image:
- **Red zones** — pixels that differ between reference and output
- **Transparent zones** — pixels that match exactly
- Large red areas = structural differences (wrong layout, missing elements)
- Small red areas = detail differences (spacing off by a few px, color slightly wrong)

### Diff verdict thresholds:
- Under 1% → Match excellent — visually identical
- 1%–5% → Close — minor differences, inspect diff image
- 5%–15% → Moderate differences — clear areas to fix
- Over 15% → Major differences — significant revision needed

---

## Iteration Rules

### Minimum rounds
- Always do at least 2 full comparison rounds
- Stop only when: no visible differences remain OR user explicitly says to stop
- Never stop after one round even if the diff looks small

### Round structure
1. Build or modify the section
2. Screenshot
3. Read and analyze the PNG
4. If Varianta B: read the diff PNG, identify specific differences
5. List exact differences with values: "gap is 24px but should be 32px", "color is #1a3a7a but reference shows #28D4FF"
6. Fix the differences
7. Screenshot again
8. Repeat until clean

### Specificity requirement
Never report vague differences. Always be specific:

```
WRONG: "The spacing looks a bit off"
CORRECT: "padding-top is 48px but reference shows 96px — needs to be var(--space-10)"

WRONG: "The color seems different"
CORRECT: "background is rgba(3,7,18,0.96) but reference shows rgba(3,7,18,0.82) — check --bg-card token"

WRONG: "The card looks smaller"
CORRECT: "card width is 185px but reference shows 205px — check .card width property"
```

### What to check every round
- [ ] Spacing and padding (exact px values)
- [ ] Font size, weight, line-height
- [ ] Colors (exact hex or rgba values)
- [ ] Alignment (flex/grid gaps, margins)
- [ ] Border-radius values
- [ ] Box shadows (color, blur, spread, offset)
- [ ] Image sizing and aspect ratios
- [ ] Breakpoint behavior (test at 1440, 1099, 375)

---

## Label Convention

Labels are set automatically based on what is being built — never ask the user.

| Section being built | Label to use |
|---|---|
| Hero section | `hero` |
| Header | `header` |
| Proof bar | `proof-bar` |
| Magic Bento / service cards | `bento` |
| Metodologie section | `metodologie` |
| Proiecte / portfolio | `proiecte` |
| Contact form | `contact` |
| Footer | `footer` |
| Full page | `homepage`, `servicii`, `contact` etc. |
| Mobile viewport | append `-mobile`: `hero-mobile` |
| Tablet viewport | append `-tablet`: `hero-tablet` |

---

## Temporary Screenshots Folder

Screenshots accumulate in `./temporary screenshots/` — this folder is for working files only.
- Auto-incremented filenames — never overwritten
- Keep during active development for comparison history
- Can be cleared at end of project or when folder becomes unwieldy
- Never commit to Git — add to `.gitignore` if needed