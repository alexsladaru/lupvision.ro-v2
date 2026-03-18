---
name: bricks-conversion
description: Invoke this skill when converting, optimizing, or auditing HTML for Bricks Builder compatibility, when running Code2Bricks conversion, when the user asks to prepare a page or section for WordPress/Bricks, or when reviewing HTML structure for import.
---

# Bricks Builder Conversion Skill (Aligned with Varianta B Architecture)

## What This Skill Does

Ensures HTML output is structurally compatible with Bricks Builder after Code2Bricks conversion.

> **Important:** This skill validates structure and class architecture. It does NOT restructure global CSS or promote classes automatically.
>
> Bricks maps structure. Global CSS remains the styling source of truth.

---

## Architectural Context (Mandatory)

This project follows Varianta B:

- Tokens → global (`:root`)
- Global utilities → global CSS
- State classes → global CSS
- Components:
  - Global reusable components → global CSS
  - Page-specific components → page `<style>` only

During conversion:
- No automatic promotion of classes
- No movement between local and global CSS
- Reuse detection results only in "Promotion Candidates"

> Global restructuring happens only at Sync Points — outside this skill.

---

## How Bricks Builder Maps HTML

Code2Bricks reads HTML and creates Bricks blocks:

| HTML Element | Bricks Block |
|---|---|
| `<section>` | Section |
| `<div>` | Div / Block |
| `<header>` | Section |
| `<nav>` | Block |
| `<main>` | Block |
| `<h1>`–`<h6>` | Heading |
| `<p>` | Text |
| `<a>` | Button (if styled) or Link |
| `<button>` | Button |
| `<img>` | Image |
| `<ul>` / `<ol>` | List |
| `<li>` | List Item |
| `<form>` | Form |
| `<input>` | Form Field |

Bricks reads structure for layout and classes for styling. It ignores all `style=""` attributes.

---

## Pre-Conversion Checklist

Run every item before sending HTML to Code2Bricks.

### Structure
- [ ] `<main>` wraps primary content
- [ ] Every `<section>` has a clear single purpose
- [ ] Max 3 nesting levels without justification
- [ ] No semantic misuse (`<div>` instead of `<section>`, `<article>`, `<nav>`)
- [ ] No empty wrapper elements
- [ ] `<header>` and `<footer>` are direct children of `<body>`
- [ ] Multiple `<nav>` elements have `aria-label`

### CSS & Class Architecture
- [ ] No `style=""` attributes in HTML
- [ ] Tokens used for colors, spacing, typography — nothing hardcoded
- [ ] No CSS Grid on outermost section wrapper
- [ ] No `:nth-child` selectors — use explicit classes
- [ ] No ID selectors for styling — IDs only for anchors and JS hooks
- [ ] Classes follow layer logic:
  - Utilities: small, reusable, generic (`u-flex`, `u-gap-3`)
  - Components: structured, contextual (`.card`, `.hero`)
  - States: `is-*`, `has-*` prefix
- [ ] Page-specific components remain local in page `<style>`
- [ ] No duplicate class definitions across global and page CSS
- [ ] No automatic global promotion mid-build

### JS
- [ ] All JS wrapped in IIFE
- [ ] JS hooks use `data-*` attributes
- [ ] State changes use class toggling
- [ ] Dynamic values set via `element.style.setProperty()` for CSS variables
- [ ] No large inline style blocks injected dynamically

> Runtime positioning (e.g. glow coordinates) is allowed if it uses CSS variables. Structural styling must always live in CSS.

---

## Common Conversion Failures & Fixes

### Inline styles in HTML
**Symptom:** Styling missing after Bricks import.
**Cause:** Bricks ignores `style=""` entirely.
**Fix:** Move every inline style to a named class.

```html
<!-- WRONG -->
<div style="display:flex; gap:16px; padding:24px">

<!-- CORRECT -->
<div class="card-body">
```

---

### Deep nesting
**Symptom:** Messy, hard-to-edit Bricks container tree.
**Fix:** Flatten structure — if a wrapper does nothing, remove it.

---

### `:nth-child` selectors
**Symptom:** Alternating or specific-item styles break after import.
**Cause:** Bricks reorders elements internally.
**Fix:** Replace with explicit modifier classes: `.card--first`, `.card--accent`.

---

### CSS Grid on section root
**Symptom:** Layout overridden or collapsed by Bricks.
**Fix:** Use Grid only inside inner containers, never on the outermost section wrapper.

---

### JS inline styling abuse
**Symptom:** Dynamically created elements appear unstyled after import.

```js
// WRONG
el.style.cssText = 'position:absolute; width:100px;'

// CORRECT — structural class in CSS, dynamic values via variables
el.classList.add('spotlight')
el.style.setProperty('--glow-x', x + 'px')
```

---

## Post-Conversion Verification

After Code2Bricks import into Bricks Builder, verify:

1. Desktop layout renders correctly
2. Tablet (≤1099px) — responsive overrides applied
3. Mobile (≤767px) — no overflow, no broken stacks
4. Utilities render correctly
5. Page-local components render correctly
6. All interactions and hover states work
7. Dark Veil canvas renders with correct `mix-blend-mode`
8. ACF comment markers preserved as placeholders

---

## Conversion Output Rules

### This skill outputs:
- Clean HTML (structure + classes only)
- Confirmation of layer separation:
  - Tokens untouched
  - Utilities untouched
  - Components correctly categorized as global or local
- List of Promotion Candidates (if reuse detected)

### This skill does NOT:
- Move classes between local and global
- Modify global CSS automatically
- Add new tokens automatically

---

## What Must Survive Conversion

These elements must be preserved exactly — never altered during conversion:

- All CSS variable names from `:root`
- All class names referenced in JS
- All `data-*` attributes used as JS hooks
- All `id` attributes used for anchors
- All `aria-*` attributes
- All ACF comment markers: `<!-- ACF: field_name -->`

> Structure integrity is critical. Styling authority remains global CSS.