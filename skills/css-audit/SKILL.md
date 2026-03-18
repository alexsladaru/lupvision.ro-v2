---
name: css-audit
description: Invoke this skill when auditing CSS for duplication, when deciding if a class should be local or global, when cleaning up inline styles, or when a second page is being built and existing classes need to be evaluated for promotion to global.
---

# CSS Audit Skill (Aligned with Varianta B + Freeze & Sync)

## What This Skill Does

Audits CSS across project files to:

- Remove inline styles
- Remove duplication
- Eliminate hardcoded values where tokens exist
- Keep CSS layered cleanly (tokens / utilities / states / components)
- Produce a **Promotion Candidates** list — no automatic promotion

> This skill protects stability. It does not reshuffle global CSS mid-build.

---

## Core Principle

Local vs global is not decided by "second appearance." It's decided at **Sync Points**.

During active build:

- Do NOT move classes into global automatically
- Do NOT rename classes automatically
- Do NOT restructure tokens automatically

Instead: keep local CSS local, record reuse signals as Promotion Candidates, apply promotions only at a Sync Point.

---

## Definitions

### Tokens

`:root` variables only. No component rules here.

### Global Utilities

Small, generic, reusable layout/helper classes.
Examples: `.container`, `.stack`, `.grid-2`, `.sr-only`, `.text-center`

### State Classes

Boolean state modifiers, reusable.
Examples: `.is-active`, `.is-hidden`, `.has-glow`

### Component Classes

- **Global component** — used across multiple pages intentionally (approved at Sync Point)
- **Local component** — unique to a page or section

---

## The Freeze Rule

Once a page is "done enough to import", its CSS structure must remain stable:

- No surprise global moves
- No surprise token reshuffles
- No surprise utility renames

> Global refactors happen only at Sync Points.

---

## Audit Process — Run in This Order

### Step 1 — Inventory

Read every CSS source:

- `[domain]-global.css`
- Every `<style>` block in every `.html` page file

Build a map for each class:

- Class name and location
- Which layer it belongs to (utility / state / component)
- Conflicts (same class defined differently in two places)

Output must include:

- Duplicate Definitions
- Conflicts
- Hardcoded Violations
- Promotion Candidates

---

### Step 2 — Inline Styles Cleanup (Immediate)

Search for `style="..."` in all HTML. Every inline style is a violation.

Convert each to a named class:

- Generic layout → utility (local now, candidate for global later)
- State behavior → state class (global if already exists, otherwise local + candidate)
- Component-specific → local component class

```html
<!-- VIOLATION -->
<div style="display:flex; gap:16px; align-items:center">
  <!-- CORRECT -->
  <div class="proof-inner"></div>
</div>
```

No exceptions.

---

### Step 3 — Hardcoded Values Cleanup

Replace hardcoded values with tokens where tokens exist:

- Colors → `var(--*)`
- Spacing → `var(--space-*)`
- Typography → `var(--font-*)`, tokenized sizes/weights
- Radius / shadows → tokenized equivalents

**Exception allowed only when:**

- There is genuinely no token equivalent
- It's truly one-off and not part of any repeated system

---

### Step 4 — Deduplicate (Strict)

A class must not be defined in two places.

- Class in both global and local — identical → delete local
- Class in both global and local — different → treat as Conflict, resolve immediately
- Class in two local page files → pick one owner page, remove from others, add to Promotion Candidates

---

### Step 5 — Conflict Resolution

If the same class name has different definitions across files:

- Freeze the definition used by the already-imported page(s)
- Align other pages to that definition OR rename the new variant

**Renaming rule:**

- Truly different component → rename with prefix: `.card` vs `.pricing-card`
- State mismatch → unify under one behavior

No silent overrides.

---

### Step 6 — Promotion Candidates (Not Auto-Promotion)

For any class that appears reusable, add to the Promotion Candidates list.

Each entry must include:

- Class name
- Current definition location (file)
- Usage count and where it appears
- Recommended layer (utility / state / global component)
- Risk note (might break imported pages if changed)

> This is advisory only. No promotion happens inside this skill.

---

### Step 7 — Global CSS Hygiene

**Global CSS must contain:**

- Tokens (`:root`)
- Base / reset
- Utilities
- States
- Global components (only those approved at Sync Point)
- Shared animations / keyframes

**Global CSS must NOT contain:**

- Page-specific positioning
- One-off section layout rules
- Selectors that reach outside their component/section scope

If page-specific rules are found in global → move back to the owning page's local `<style>` and mark as "Global Pollution Fix".

---

## After Audit — Verification

1. Every page renders correctly locally
2. No class duplicated across files
3. No class defined in both global and local (unless identical — then local is removed)
4. All breakpoints verified
5. Screenshots taken if any page was visually touched

---

## Sync Point Procedure (Only When Triggered Elsewhere)

When it's time to update global:

1. Review Promotion Candidates list
2. Approve what moves global (utilities / states / global components)
3. Apply changes to `[domain]-global.css`
4. Remove moved definitions from all local files
5. Re-test screenshots and conversion integrity

> This skill does not initiate Sync Points.

---

## What Belongs Where

### Global CSS ✓

- Tokens (`:root`)
- Reset / base
- Utilities
- States
- Animations / keyframes
- Approved global components (Sync Point only)

### Local CSS ✓

- Page/section specific layout
- Unique component visuals
- Local responsive overrides

### Nowhere ✗

- Inline styles
- Duplicated class definitions
- Hardcoded values that have token equivalents
- ID selectors for styling
- CSS that targets elements outside its own section scope
