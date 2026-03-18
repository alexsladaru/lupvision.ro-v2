# CLAUDE.md — lupvision.ro

# Project-specific context. Inherits all rules from Website-uri/Flux de lucru/CLAUDE.md (Varianta B Architecture).

---

## Project

- **Client:** Lup Vision (Romanian web agency)
- **Site:** lupvision.ro
- **Type:** Agency presentation website

---

## Pages

1. Front page (homepage)
2. Servicii
3. Proiecte
4. Contact / Începe proiectul
5. Politică de confidențialitate
6. Termeni și condiții
7. Politică de cookie-uri

> Content and structure for each page TBD — do not invent content.
> Pages are finalized one by one. Global architecture changes occur only at Sync Points.

---

## Breakpoints

- **Desktop:** default
- **Tablet:** ≤ 1099px
- **Mobile:** ≤ 767px

> Breakpoints are frozen. Do not introduce new ones.

---

## Design Tokens (Global, Frozen Early)

Tokens live in `lupvision.ro-global.css` and Bricks Style Manager.

### Typography

--font-logo: Cascadia Code;

````

### Spacing Scale (8px base)
```css
--space-1: 8px    --space-2: 16px   --space-3: 24px
--space-4: 32px   --space-5: 40px   --space-6: 48px
--space-7: 56px   --space-8: 64px   --space-9: 80px
--space-10: 96px  --space-11: 128px
````

### Section Padding

- Desktop: `96px` vertical
- Tablet: `64px` vertical
- Mobile: `48px` vertical

> Tokens may not be modified mid-page build. Any addition must be declared in Sync Changelog.

---

## CSS Architecture

### Global File — `lupvision.ro-global.css`

Contains:

- Tokens (`:root`)
- Reset / base styles
- Global utilities (`u-*`)
- State classes (`is-*`, `has-*`)
- Generic reusable components (buttons, cards, layout containers)
- Keyframes
- Global responsive rules

> This file is the styling source of truth.

### Page Files (e.g. `index.html`)

Each page file may contain:

- Clean semantic HTML
- Class composition only — no inline styles
- A `<style>` block with **only** page-specific components
- Optional inline `<script>` for page-specific logic (IIFE only)

> Page files must not duplicate anything already defined in global CSS.

---

## Component Strategy

### Global Components (Reusable Across Pages)

Live in global CSS:

- `.btn-main`
- `.btn-ghost`
- `.nav-cta`
- Generic `.card`
- Layout containers

### Page-Specific Components (Remain Local)

Stay in page `<style>` block:

- `.hero`
- `.magic-bento`
- `.fan-wrap`
- `.proof-bar`
- Any unique section styling

> Even if reused conceptually, they remain local unless explicitly promoted at Sync Point. No automatic promotion.

---

## Freeze & Sync Policy

### During page build:

- No class is moved from local to global
- No utilities are auto-promoted
- Reuse observations recorded only as Promotion Candidates

### After page completion:

- Output Deliverables + Changelog
- Promotion happens only if explicitly approved
- Promotion applies mainly to utilities or state classes
- Component classes are **not** promoted automatically

---

## Global Files

- `lupvision.ro-global.css` — design system backbone
- `lupvision.ro-global.js` — shared logic across all pages:
  - Header scroll
  - Hamburger menu
  - Scroll reveal
  - Page load animations
  - Dark Veil shader

> Global JS must not contain page-specific logic.

---

## JS Architecture

- Global JS → shared behavior only
- Page-specific JS → inline in that page
- All JS in IIFE
- Use class toggling and CSS variables
- Avoid injecting raw inline style blocks unless strictly dynamic

---

## Button & Class Naming — FROZEN

Do not rename these — they are global component contracts:

- `btn-main`
- `btn-ghost`
- `nav-cta`

---

## Tagline

> "Prezența digitală este cartea de vizită a afacerii tale. Noi o facem de neignorat."

---

## Built Sections — Front Page

### Header

- 74px height, fixed
- Transparent → frosted on scroll
- Global CSS component

### Hero

- `h1` clamp(2rem, 5vw, 3rem)
- 32px vertical gaps
- Dark Veil shader, hero glow, grid overlay
- `.hero` remains page-local component
- `overflow: hidden`

### Magic Bento

- 18 service cards
- Fan desktop / flat tablet / stacked mobile
- `.fan-wrap` page-local
- Orbit animation persists
- Glow effect uses CSS variables set via JS

### Proof Bar

- 5 statistics
- IntersectionObserver counter animation
- Wrapped in `<main id="main">`

---

## Animations

### Global (in `lupvision.ro-global.css`):

- `rise` keyframe
- Delay classes
- Shared easing

### Page-specific:

- Hero glow
- Fan orbit
- Bento glow tracking

---

## ACF Structure (Planned)

- CPT: `lv_project`
- Options Page for global content
- Repeaters for: methodology steps, proof stats, project items
- No Flexible Content without explicit approval

---

## Status

**Front page** — complet (structură HTML + CSS)

- [x] Header
- [x] Hero
- [x] Magic Bento
- [x] Proof Bar
- [x] Metodologie — `.meto-*`, 2×2 grid, numere decorative mari
- [x] De ce Lup Vision — `.dce-*`, sticky left + listă cu marker
- [x] Proiecte Reprezentative — `.proj-*`, 3-col grid, placeholder ACF
- [x] FAQ — `.faq-*`, accordion JS, 6 întrebări
- [x] CTA Final — `.cta-*`, centered, 2 butoane

**Other pages**

- [x] Servicii — `servicii.html`, `srv-` prefix, 6 service sections, strip nav, process, CTA
- [x] Misiunea noastră — `misiunea-noastra.html`, `ms-` prefix, split layout, browser mockup, CTA
- [x] Proiecte — `proiecte.html`, `pf-` prefix, 3 project blocks (browser frame + img slots), disabled filters, mini end section
- [x] Contact — `contact.html`, `ct-` prefix, hero + form section (CF7 template) + info cards, no CTA final
- [x] Legal pages — `confidentialitate.html`, `termeni.html`, `cookies.html`, prefix `lg-`, sticky TOC sidebar, tabel cookie-uri, drepturi GDPR grid

> Nav note: "Misiunea noastră" links to `misiunea-noastra.html` on sub-pages. On `index.html` it still links to `#metodologie` — sync decision pending.

---

## File Structure

```
lupvision.ro/
├── index.html
├── servicii.html
├── proiecte.html
├── contact.html
├── confidentialitate.html
├── termeni.html
├── cookies.html
├── lupvision.ro-global.css
├── lupvision.ro-global.js
├── CLAUDE.md
└── skills/
```

---

## Enforcement Summary

- Global CSS is the stable backbone
- Page CSS handles section-specific styling only
- No mid-build global restructuring
- All structural changes happen at Sync Points
- Bricks is renderer and token manager — not styling authority

---

# Architecture Log

This section tracks architectural evolution of the project.

All reuse discoveries are recorded here.
No class is promoted without being logged here first.

---

## Promotion Candidates

### Template

- Class name:
- Defined in:
- Reused in:
- Suggested layer: (utility / state / global component)
- Risk level: (low / medium / high)
- Status: (pending / approved / rejected / merged / renamed)
- Sync decision notes:

---

## Current Candidates

### 1. `.dce-marker` dot pattern

- Class name: `.dce-marker`
- Defined in: `index.html` (De ce Lup Vision)
- Reused in: potențial în orice secțiune cu list items marcate
- Suggested layer: utility
- Risk level: low
- Status: pending
- Sync decision notes: glyph simplu (6px dot, accent, glow). Candidat dacă apare în alte pagini.

### 2. `.proj-result` chip

- Class name: `.proj-result`
- Defined in: `index.html` (Proiecte Reprezentative)
- Reused in: potențial `proiecte.html`
- Suggested layer: global component
- Risk level: medium
- Status: pending
- Sync decision notes: chip cu dot indicator + mono text. Dacă `proiecte.html` folosește același pattern, se promovează la Sync Point.

### 3. `.section-label` + `.section-desc` (deja global)

- Status: merged — prezente în `lupvision.ro-global.css`

### 4. Reveal stagger JS pattern

- Defined in: `index.html` (IIFE cu configs array)
- Reused in: va fi necesar pe fiecare pagină cu secțiuni staggered
- Suggested layer: global JS utility
- Risk level: low
- Status: pending
- Sync decision notes: dacă pattern-ul apare pe 2+ pagini, se mută în `lupvision.ro-global.js` ca funcție exportată.
