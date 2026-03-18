---
name: external-components
description: Invoke this skill when the user provides code from React Bits, 21st.dev, CodePen, GitHub, or any other external source that uses React, JSX, Tailwind, Framer Motion, GSAP, Lottie, or other frameworks. Always adapt to project stack — never import as-is.
---

# External Components Skill (Aligned with Varianta B Architecture)

## What This Skill Does

Converts external component code into clean vanilla HTML + CSS + JS compatible with:

WordPress + Bricks Builder + ACF Pro + Code2Bricks.

Preserves:
- Visual output
- Animation behavior
- Interaction logic

Adds:
- Zero new dependencies
- Zero architectural pollution
- Zero automatic global promotions

---

# Architectural Context (Mandatory)

This project uses 4 layers:

1. Tokens (global values)
2. Global utilities (small reusable behaviors)
3. Component classes (structured blocks)
4. State classes (`is-*`, `has-*`)

External components must be mapped into this structure.

---

## Critical Rule

External components must NOT:
- Inject new global utilities automatically
- Inject new tokens automatically
- Pollute global CSS
- Break Freeze Rule

All new reusable patterns are recorded as Promotion Candidates.
Promotion happens only at Sync Point.

---

# Conversion Process — Strict Order

## Step 1 — Full Analysis

Before converting:
- Identify framework used
- Identify dependencies
- Identify visual behavior
- Identify animation logic
- Identify reusable patterns
- Identify inline style abuse
- Identify Tailwind or utility overload

Never start rewriting until structure and behavior are fully understood.

---

## Step 2 — Extract Clean HTML Structure

Remove:
- React / JSX syntax
- motion components
- Fragment wrappers
- Conditional render syntax
- Framework-only constructs

Convert:

- `className` → `class`
- `{variable}` → `<!-- ACF: field_name -->` or static content
- `motion.div` → `div`

HTML must:
- Be semantic
- Be flat (max 3 nesting levels)
- Be Bricks-compatible
- Contain only classes (no inline styles)

---

## Step 3 — CSS Conversion (Layered Properly)

### Rule 1 — Tokens First

All scalable values must use tokens:
- spacing → `var(--space-*)`
- colors → `var(--*)`
- radius → `var(--radius)`
- blur/shadows → existing effect tokens

If token does not exist:
- Record as Token Candidate
- Do not auto-create mid-build

---

### Rule 2 — Separate Utilities from Components

If styling is:
- Generic layout (flex, grid, gap, center)
→ Convert into utility class (local for now, candidate for global)

If styling is:
- Identity-specific (card skin, hero background, complex shape)
→ Component class (local to page)

Never merge component identity into utilities.

---

### Tailwind Mapping

Tailwind classes must never be kept.

Replace with:
- Project tokens
- Utilities
- Component classes

No `transition-all`.  
Animate only `transform` and `opacity`.

---

### CSS Modules

Extract rules and convert:
- Hardcoded colors → tokens
- Hardcoded spacing → tokens
- Preserve visual proportions

---

### Inline Styles

Every inline style becomes:
- Utility (if generic)
- Component class (if specific)
- State class (if conditional behavior)

No inline `style=""` survives conversion.

---

## Step 4 — JS & Animation Conversion

### Framer Motion
Convert to:
- CSS keyframes
- Transition rules
- State classes
- IntersectionObserver if needed

### GSAP / anime.js
Convert to:
- CSS animation
- IntersectionObserver
- requestAnimationFrame (if absolutely required)

### React Hooks
Convert to:
- IIFE
- Class toggling
- `aria-*` attribute updates
- CSS variable updates

---

## JS Rules

- Wrapped in IIFE
- No dependencies
- No DOM structure rewriting
- No large inline style injection
- May update CSS variables
- Must toggle classes for state

---

## Dependency Elimination

For each dependency:

| Library | Replacement |
|----------|-------------|
| Framer Motion | CSS + transitions |
| GSAP | CSS + IO |
| anime.js | CSS + rAF |
| jQuery | Vanilla DOM |
| Tailwind | Tokens + utilities |
| clsx / cn | Static class strings |
| Radix UI | Native HTML + ARIA |
| shadcn | Extract HTML only |
| Three.js | Only if essential (flag) |
| Lottie | Replace if possible |

If a dependency is essential (complex shader, canvas system):
- Flag explicitly
- Ask for approval
- Document in Promotion Candidates or Architecture Log

---

## Step 5 — Layer Validation

Before delivering:

- [ ] No inline styles
- [ ] Tokens used correctly
- [ ] Utilities separated from component styling
- [ ] No automatic global injection
- [ ] Page-specific component remains local
- [ ] No new global utilities without candidate logging
- [ ] Bricks compatibility confirmed (run bricks-conversion checklist)
- [ ] ACF placeholders inserted where needed
- [ ] Accessibility preserved
- [ ] SEO preserved

---

## Step 6 — Freeze Rule Compliance

If conversion introduces:
- Reusable utility patterns
- State classes
- Reusable layout systems

Then:

- Record as Promotion Candidate
- Do NOT move into global CSS automatically

Promotion only at Sync Point.

---

## Step 7 — Visual Verification

Take screenshot.
Compare visually with source:
- proportions
- animation timing feel
- spacing
- color adaptation
- interaction behavior

Must match visually.
May adapt color to project palette.
Never import foreign brand palette.

---

# What Never Gets Imported

- React/Vue/Svelte syntax
- Tailwind classes
- CSS frameworks
- `package.json` deps
- TypeScript types
- Next.js APIs
- Debug logs
- CDN script tags
- Unnecessary polyfills

---

# Output Format
<!-- HTML -->
<section class="component-name">
  ...
</section>
<style>
/* Page-local component CSS */
.component-name { ... }
</style>
<script>
(function() {
  ...
})();
</script>
No automatic global injection.
No architectural reshuffle.
Ready for Code2Bricks.