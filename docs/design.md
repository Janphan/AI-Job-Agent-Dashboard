# Design System

## Philosophy

- Dark-first theme with violet/purple accent
- Clean, readable — prioritise accessibility (WCAG AA contrast)
- Minimal gradients, intentional spacing

## Surface Hierarchy

| Token              | Usage                  | Hex          |
|--------------------|------------------------|--------------|
| `surface-page`     | Page background        | `#0f0a1e`    |
| `surface-card`     | Cards, containers      | `#1e1b2e`    |
| `surface-card-hover` | Card hover state     | `#26223a`    |
| `surface-modal`    | Modal background       | `#1e1b2e`    |
| `surface-elevated` | Dropdowns, popovers    | `#2a2640`    |
| `surface-input`    | Input fields           | `#1e1b2e`    |

## Text Hierarchy

| Token              | Usage                  | Hex          | Contrast on card |
|--------------------|------------------------|--------------|------------------|
| `text-heading`     | Titles, headings       | `#f1f5f9`    | >15:1            |
| `text-body`        | Body content           | `#e2e8f0`    | ~12:1            |
| `text-muted`       | Secondary info, labels | `#94a3b8`    | ~6:1             |
| `text-placeholder` | Input placeholders     | `#64748b`    | ~4.5:1           |

## Accent / Interactive

| Token                          | Usage                        | Hex       |
|--------------------------------|------------------------------|-----------|
| `interactive-primary`          | Primary buttons, focus       | `#7c3aed` |
| `interactive-primary-hover`    | Primary button hover         | `#8b5cf6` |
| `interactive-primary-muted`    | Muted primary bg             | `#7c3aed` at 15% |
| `interactive-ghost-hover`      | Ghost button hover           | White at 6% |

## Status Colors

| Token        | Hex       | Usage                 |
|--------------|-----------|-----------------------|
| `success`    | `#34d399` | Strengths, high score |
| `warning`    | `#fbbf24` | Missing skills        |
| `error`      | `#f87171` | Errors, low score     |
| `info`       | `#60a5fa` | Summary, info cards   |

Each status has `*-bg` (10% opacity) and `*-border` (30% opacity) variants.

## Match Score Colors

| Range     | Token              | Hex       |
|-----------|--------------------|-----------|
| 90-100%   | `score-excellent`  | `#34d399` |
| 75-89%    | `score-strong`     | `#22d3ee` |
| 60-74%    | `score-good`       | `#a78bfa` |
| 40-59%    | `score-fair`       | `#fbbf24` |
| 0-39%     | `score-low`        | `#f87171` |

## Borders

| Token           | Hex                        |
|-----------------|----------------------------|
| `border-default`| White at 8%                |
| `border-hover`  | White at 15%               |
| `border-active` | `#7c3aed`                  |

## Typography

- Base: 16px, `Inter` / system sans-serif
- Scale: text-xs (12px) → text-base (16px) → text-lg (18px) → text-xl (20px) → text-2xl (24px) → text-3xl (30px) → text-4xl (36px) → text-5xl (48px)

## Accessibility Checklist

- [ ] Text-body on surface-card: contrast ≥ 7:1
- [ ] Text-muted on surface-card: contrast ≥ 4.5:1
- [ ] All interactive elements have `focus-visible:ring-2` (violet)
- [ ] Touch targets ≥ 44px (mobile)
- [ ] Color is never the only indicator (use labels/icons alongside)

## Tailwind Usage

Tokens are available as Tailwind utility classes via `@theme inline`. Examples:

```css
bg-surface-card
text-text-body
border-border-default
bg-interactive-primary
text-status-success
focus-visible:ring-2 focus-visible:ring-focus-ring
```

> **Note:** Components currently use raw gray/violet utility classes (e.g. `bg-gray-800`, `text-violet-400`). Migrate to semantic tokens gradually by replacing with `bg-surface-card`, `text-interactive-primary`, etc. defined above.
