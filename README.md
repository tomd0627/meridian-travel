# Meridian Travel

A fictional luxury travel agency landing page. Portfolio piece built to demonstrate editorial web design, semantic HTML, modern CSS, and vanilla JavaScript — without a framework or build step.

---

## What this demonstrates

### No-framework discipline

Everything is plain HTML, CSS, and ES6+ JavaScript. No React, no Vite, no PostCSS. The constraints force intentional decisions about every line.

### CSS architecture

- Design tokens in `css/tokens.css` — a single source of truth for every colour, spacing step, and shadow
- CSS logical properties throughout (`margin-inline`, `padding-block`, `inset-inline-start`) for inherent i18n-readiness
- Named CSS Grid areas in the destinations section that **recompose** at three breakpoints rather than just collapsing to a single column:

  ```
  Desktop (6-col)   "amalfi" — full width          Tablet (2-col)  "amalfi kyoto"
                    "kyoto patagonia marrakech"     (equal halves)  "patagonia marrakech"
                    "santorini maldives"                            "santorini maldives"
  ```

- Properties in strict alphabetical order, enforced by Stylelint

### JavaScript behaviours (`js/main.js`, `js/form.js`)

| Behaviour                                                  | API                           |
| ---------------------------------------------------------- | ----------------------------- |
| Scroll-reveal for any `[data-reveal]` element              | `IntersectionObserver`        |
| Sticky journey sidebar — highlights the lowest visible day | `IntersectionObserver`        |
| Mobile itinerary select — syncs with scroll, jumps to day  | `IntersectionObserver` + `change` listener |
| Header scroll state                                        | passive `scroll` listener     |
| Mobile nav toggle with `aria-expanded` state               | click handler                 |
| 2-step enquiry form with per-field validation              | custom validation, no library |

### Accessibility (WCAG 2.1 AA)

- Skip link → `#main-content`
- `aria-expanded`, `aria-controls`, `aria-label` on the nav toggle
- `aria-describedby` + `role="alert"` + `aria-atomic="true"` on every form error
- `aria-required="true"` on all required inputs
- All `<picture>` images have explicit `width`, `height`, descriptive `alt`
- `tabindex="-1"` on elements that receive programmatic `.focus()`

### Pre-commit quality gates

Every staged file passes through Husky + lint-staged:

| Tool                    | Checks                                                           |
| ----------------------- | ---------------------------------------------------------------- |
| Prettier                | 2-space indent, single quotes, trailing commas, LF               |
| ESLint v9 (flat config) | `eqeqeq`, `no-console`, `no-unused-vars`                         |
| Stylelint               | alphabetical property order, logical properties, standard config |
| html-validate           | lowercase doctype, self-closing void elements                    |

### End-to-end tests (Playwright)

13 tests across 7 suites in `tests/journey.spec.js`:

- Reveal animations (IntersectionObserver)
- Header scroll state
- Mobile nav toggle
- Form step 1 validation + step transition
- Form back navigation with value preservation
- Form step 2 validation (empty fields, bad email, out-of-range group size)
- Form submission → confirmation focus

### Deployment

Netlify. `netlify.toml` sets:

- **1-year `immutable` cache** on `/css/*`, `/js/*`, `/images/*`, `/icons/*`
- Security headers on every response (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Content-Security-Policy`)

---

## Tech stack

| Layer   | Choice                                                                  |
| ------- | ----------------------------------------------------------------------- |
| Markup  | HTML5                                                                   |
| Styles  | CSS3 — logical properties, custom properties, Grid, `@keyframes`        |
| Scripts | Vanilla JS ES6+ (`sourceType: script`, no modules)                      |
| Fonts   | Cormorant Garant (serif) + DM Sans (sans) via Google Fonts preload/swap |
| Icons   | Phosphor Icons (MIT) — individual SVGs inlined                          |
| Testing | Playwright + `@playwright/test`                                         |
| Linting | ESLint v9 · Stylelint · html-validate · Prettier                        |
| Hooks   | Husky + lint-staged                                                     |
| Hosting | Netlify                                                                 |

---

## Local development

```bash
# Serve the project (any static server works)
npx http-server . -p 4000

# Run E2E tests (starts its own server automatically)
npm test

# Lint everything
npm run lint

# Format everything
npm run format
```

> **Images:** Real AVIF + WebP files are in place, sourced from [Unsplash](https://unsplash.com) (free to use). SVG colour-field placeholders remain as `<img>` fallbacks in the `<picture>` elements. The download script lives in `scripts/download-images.js` if you need to regenerate them.

---

## File map

```
css/
  tokens.css            Design tokens (custom properties only)
  reset.css             Modern CSS reset
  base.css              Body and type defaults
  layout.css            Container and section spacing
  components.css        Cards, buttons, form, timeline
  animations.css        Reveal keyframes and hover states
  responsive.css        Breakpoint overrides (sm/md/lg/xl)

js/
  main.js               IntersectionObserver behaviours, header, nav toggle, mobile itinerary select
  form.js               2-step enquiry form with validation

tests/
  journey.spec.js       Playwright E2E suite

scripts/
  download-images.js    Regenerates AVIF/WebP images from Unsplash

index.html              Single-page entry point
favicon.svg             Site icon
netlify.toml            Cache + security headers
playwright.config.js
```

---

## License

MIT — see [LICENSE](LICENSE).
