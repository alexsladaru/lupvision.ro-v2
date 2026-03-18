---
name: html-structure
description: Invoke this skill when writing or auditing HTML structure for any page or section, when preparing HTML for Bricks Builder import, when reviewing nesting depth or semantic correctness, or when deciding how to structure a new section or component.
---

# HTML Structure Skill — Bricks Builder Mandatory Rules

## What This Skill Does

Enforces predictable, flat, role-specific HTML structure that maps cleanly onto Bricks Builder blocks after Code2Bricks conversion. Every rule here exists because Bricks maps one HTML element to one block — ambiguous or mixed-purpose structure creates fragile, hard-to-edit imports.

---

## Rule 1 — Section Discipline

Every major page block starts with `<section>`. No wrapper sections used only for spacing or background. `<main id="main">` wraps all primary page sections. `<header>` and `<footer>` are direct children of `<body>`.

```html
<!-- CORRECT -->
<body>
  <header class="site-header">...</header>

  <main id="main">
    <section class="sec-hero">...</section>
    <section class="sec-proof">...</section>
  </main>

  <footer class="site-footer">...</footer>
</body>
```

Each `<section>` must represent a real content block — never a spacing or decoration wrapper.

---

## Rule 2 — Standard Section Skeleton

Every section follows this preferred structure:

```html
<section class="sec-name">
  <div class="container">
    <header class="sec-head">
      <h2 class="sec-title">...</h2>
      <p class="sec-desc">...</p>
    </header>

    <div class="sec-body">
      <!-- layout (grid/flex) lives here -->
    </div>
  </div>
</section>
```

- `<section>` — logical content block
- `.container` — width control + horizontal padding
- `.sec-head` — optional heading group
- `.sec-body` — internal layout (grid, flex, columns)
- Layout systems belong inside `.sec-body`, never on `<section>` itself

---

## Rule 3 — One Purpose Per Element

An element must not have multiple architectural roles.

```html
<!-- WRONG — one div doing everything -->
<div class="container grid card overlay">...</div>

<!-- CORRECT — each element has one role -->
<div class="container">
  <div class="sec-body">
    <article class="card">...</article>
  </div>
</div>
```

- Container handles width
- Grid/flex wrapper handles layout
- Card handles component identity

Bricks maps one HTML element → one block. Mixed responsibilities break the import.

---

## Rule 4 — Nesting Depth

Maximum 3 levels of nesting without explicit justification.

Typical pattern:
```
section → container → component
```

Deep nesting breaks editability inside Bricks. If you need a 4th level, there must be a clear reason — document it.

---

## Rule 5 — Class-Driven Styling Only

Never style bare tags except in reset/base. Never rely on contextual selectors.

```css
/* WRONG */
section h2 { ... }
.hero p { ... }

/* CORRECT */
.hero-title { ... }
.hero-desc { ... }
```

Every styled element must have an explicit class:

```html
<!-- WRONG -->
<h2>Titlu secțiune</h2>

<!-- CORRECT -->
<h2 class="sec-title">Titlu secțiune</h2>
```

---

## Rule 6 — No Layout Logic on Outer Section

Never apply `display: grid` or complex flex/grid systems directly to `<section>` root. Use layout classes inside `.container` or `.sec-body` instead.

```css
/* WRONG */
.sec-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

/* CORRECT */
.sec-hero .sec-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
```

Bricks handles outer container layout internally. Applying grid to `<section>` conflicts with Bricks container system.

---

## Rule 7 — No Structural Pseudo-Selectors

Never use `:nth-child`, `:first-child`, `:last-child` for structural styling. Bricks may reorder elements internally — pseudo-selectors break unpredictably after import.

```css
/* WRONG */
.card:nth-child(2) { background: var(--accent); }
.card:last-child { margin-bottom: 0; }

/* CORRECT — explicit modifier classes */
.card--featured { background: var(--accent); }
.card--last { margin-bottom: 0; }
```

---

## Rule 8 — JS Hooks Separation

Styling classes are for CSS only. JS hooks must use `data-*` attributes or IDs — never reuse styling classes as JS selectors.

```html
<!-- WRONG — styling class used as JS hook -->
<div class="accordion" id="accordion-1">

<!-- CORRECT — separated concerns -->
<div class="accordion" data-accordion id="accordion-main">
```

```js
// WRONG
document.querySelectorAll('.accordion')

// CORRECT
document.querySelectorAll('[data-accordion]')
```

---

## Rule 9 — Every Section Has a Heading

Each `<section>` must contain a visible heading OR an `sr-only` heading. No silent sections allowed.

```html
<!-- Visible heading -->
<section class="sec-proof">
  <div class="container">
    <h2 class="sec-title">Rezultate reale</h2>
    ...
  </div>
</section>

<!-- sr-only heading for purely visual sections -->
<section class="sec-hero">
  <div class="container">
    <h2 class="sr-only">Hero</h2>
    ...
  </div>
</section>
```

Supports both SEO heading hierarchy and Bricks heading block mapping.

---

## Rule 10 — Lists Must Be Real Lists

If content is semantically a list, use `<ul>` / `<ol>` with `<li>`. Never simulate lists with multiple `<div>` elements.

```html
<!-- WRONG -->
<div class="features">
  <div class="feature-item">...</div>
  <div class="feature-item">...</div>
</div>

<!-- CORRECT -->
<ul class="features">
  <li class="feature-item">...</li>
  <li class="feature-item">...</li>
</ul>
```

---

## Rule 11 — No Inline Behavior

Forbidden in HTML:
- `style="..."` attributes
- `onclick="..."` attributes
- Any inline event attributes

All behavior lives in JS IIFE files. All styling lives in CSS classes.

```html
<!-- WRONG -->
<button style="color: red" onclick="doSomething()">Click</button>

<!-- CORRECT -->
<button class="btn-main" data-action="submit">Click</button>
```

---

## Quick Validation Checklist

Before submitting any HTML for Bricks import:

- [ ] `<main id="main">` wraps all primary sections
- [ ] Every `<section>` represents a real content block
- [ ] Section skeleton: `section → container → sec-body`
- [ ] No element has more than one architectural role
- [ ] Max 3 nesting levels (with justification if exceeded)
- [ ] Every styled element has an explicit class
- [ ] No layout grid/flex on `<section>` root
- [ ] No `:nth-child`, `:first-child`, `:last-child` selectors
- [ ] JS hooks use `data-*` or IDs, never styling classes
- [ ] Every `<section>` has a heading (visible or `sr-only`)
- [ ] Lists use `<ul>` / `<ol>` with `<li>`
- [ ] No `style=""` or inline event attributes

---

## Summary Rule

If an HTML structure is flat, semantic, class-driven, separates layout from component identity, and follows the `section → container → content` pattern — it will import cleanly into Bricks and remain editable.