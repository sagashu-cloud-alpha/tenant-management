# Tenant Management — Design System

Ported 1:1 from the real product, **cas-client-platform** (`libs/shared/theme`, `libs/shared/icons`), so this app is visually indistinguishable from the rest of Cloud Alpha. Built on Tailwind CSS v4 (`@theme inline` in `app/globals.css`) + shadcn/ui primitives — same stack this repo already uses, re-themed to match exactly.

Source of truth in the main repo: `C:\Cloud_alpha_solutions\Frontend\cas-client-platform\libs\shared\theme\` and `...\libs\shared\icons\`.

## 1. Brand

- Product family: **Cloud Alpha** — NimbusIQ-derived visual language.
- Brand color: **blue `#2878E5`** (not the generic shadcn blue). Used for links, primary actions, active nav, focus rings, chart accents.
- Font: **Outfit** (variable, Google Fonts) — geometric sans, used for everything including headings (no separate display font).
- Tone: dense, professional SaaS console. Small type (13–14px body), tight radii (6–12px, never fully rounded except pills/avatars), thin 1px hairline borders, subtle shadows — not a marketing/landing aesthetic.

## 2. Color tokens

All colors are stored as **space-separated RGB channels** (e.g. `--color-brand: 40 120 229`) so Tailwind v4 can apply opacity modifiers (`bg-brand/10`) via `rgb(var(--x) / <alpha>)` or native color-mix. Defined once in `:root` (light) and overridden in `.dark`.

### Light

| Token | RGB | Hex | Use |
|---|---|---|---|
| `surface-page` | 242 245 250 | `#F2F5FA` | app background |
| `surface-card` | 255 255 255 | `#FFFFFF` | cards, sidebar, header, inputs |
| `surface-raised` | 246 248 252 | `#F6F8FC` | table heads, inset panels |
| `surface-hover` | 235 242 253 | `#EBF2FD` | row/nav hover (brand tint) |
| `surface-selected` | 219 234 254 | `#DBEAFE` | selected row/item |
| `text-primary` | 14 28 47 | `#0E1C2F` | headings, body |
| `text-secondary` | 82 99 122 | `#52637A` | labels, muted body |
| `text-tertiary` | 164 181 204 | `#A4B5CC` | captions, placeholders |
| `border-default` | 224 228 235 | `#E0E4EB` | standard dividers |
| `border-subtle` | 238 241 246 | `#EEF1F6` | hairlines |
| `border-strong` | 196 205 215 | `#C4CDD7` | inputs on hover, emphasis |
| `brand` | 40 120 229 | `#2878E5` | primary actions, links, active state |
| `brand-hover` | 21 80 184 | `#1550B8` | brand hover/active |
| `success` | 5 150 105 | `#059669` | bg `#ECFDF5` text `#047857` |
| `warning` | 217 119 6 | `#D97706` | bg `#FFFBEB` text `#B45309` |
| `error` | 220 38 38 | `#DC2626` | bg `#FEF2F2` text `#B91C1C` |
| `info` | 79 70 229 | `#4F46E5` | bg `#EEF2FF` text `#4338CA` |

### Dark

| Token | RGB | Hex |
|---|---|---|
| `surface-page` | 11 17 32 | `#0B1120` |
| `surface-card` | 19 29 46 | `#131D2E` |
| `surface-raised` | 26 37 64 | `#1A2540` |
| `surface-sidebar` | 15 22 38 | `#0F1626` |
| `surface-hover` | 30 45 72 | `#1E2D48` |
| `surface-selected` | 24 58 100 | `#183A64` |
| `text-primary` | 236 242 251 | `#ECF2FB` |
| `text-secondary` | 160 180 210 | `#A0B4D2` |
| `text-tertiary` | 88 110 145 | `#586E91` |
| `border-default` | 40 54 80 | `#283650` |
| `border-strong` | 60 80 115 | `#3C5073` |
| `brand` | 96 165 250 | `#60A5FA` |
| `brand-hover` | 147 197 250 | `#93C5FA` |
| `success` | 52 211 153 | bg `#064E3B` text `#A7F3D0` |
| `warning` | 251 191 36 | bg `#78350F` text `#FDE68A` |
| `error` | 248 113 113 | bg `#7F1D1D` text `#FECACA` |
| `info` | 129 140 248 | bg `#312E81` text `#C7D2FE` |

Avatar mark uses a fixed **indigo→violet gradient** (`#6366f1 → #8b5cf6`), independent of theme — not the brand blue.

## 3. Typography

- Font family: `'Outfit Variable', 'Outfit', ui-sans-serif, system-ui, sans-serif`
- Base body: 14px / 1.5, no letter-spacing tricks (unlike generic shadcn `-0.015em`).
- Scale:
  - Page title: 20px / 700 / -0.02em
  - Section title / card title: 14px / 600
  - Body: 14px / 400
  - Body small: 12.5px
  - Caption: 11–11.5px, tertiary color, sometimes uppercase + 0.5–1.2px tracking for eyebrows/nav labels
  - KPI/stat value: 24px / 700 / -0.04em

## 4. Radius, shadow, motion

- Radius: `sm 6px` · `md 8px` (default control radius) · `lg 10px` · `xl 12px` (cards, modals, stat cards)
- Shadows (light): `xs 0 1px 2px rgba(10,25,60,.06)` · `sm 0 1px 4px rgba(10,25,60,.08),0 1px 2px rgba(10,25,60,.05)` · `md 0 8px 24px rgba(10,25,60,.12),0 2px 8px rgba(10,25,60,.06)` · `lg 0 16px 48px rgba(10,25,60,.14),0 4px 12px rgba(10,25,60,.08)` — dark mode swaps to near-black rgba at higher alpha.
- Motion: `fast 120ms` · `normal 200ms` · ease `cubic-bezier(0.4,0,0.2,1)`. Sidebar width transition `0.22s` same curve.

## 5. Layout metrics

- Sidebar: **220px** expanded, **56px** collapsed (icon-only), white/`surface-sidebar` bg, 1px right border.
- Header: **58px** fixed height, sticky, 1px bottom border, 22px horizontal padding (12px on mobile).
- Nav item: 36px tall, 8px radius, 13.5px/400 text, 16×16 icon at 0.65 opacity (1 on hover/active). Active = `brand/10%` bg + brand text + 500 weight.
- Buttons: default height **34px**, small **28px**, radius `md` (8px), 13–14px/500 text.
- Inputs: height **36px**, radius `md`, 1px border, brand focus ring at 14–20% opacity.
- Content padding: 20px desktop, 16px tablet, 12px mobile.

## 6. Core components

Class names below mirror the reference (`libs/shared/theme/tailwind/components.css`, `forms-panels.css`) — implemented as `@layer components` utilities in `app/globals.css` here, and wired into the existing shadcn primitives (`Button`, `Badge`, `Card`, `Input`, `Sidebar`) so app code keeps using those components unchanged.

- **Buttons** — `.btn` base + `.btn-primary` (solid brand) / `.btn-secondary` (card bg + border) / `.btn-ghost` (transparent). Mapped onto shadcn's `Button` variants (`default`→primary, `outline`/`secondary`→secondary, `ghost`→ghost).
- **Badges** — pill, 20px tall, 11px/600 text. Status variants: `success` / `warning` / `error` / `info` / `neutral`, each `bg/15%` + matching `-text` color (not the raw status color, for AA contrast).
- **Card** — `.card` (12px radius, 1px border, white bg) → `.card-head` / `.card-body` / `.card-foot`, each with their own border + padding rhythm (14–18px).
- **Stat card** — `.stat-card`: 12px radius, top 2px brand gradient accent bar, 38×38 icon tile, 24px/700 value, tertiary caption.
- **Avatar** — circle/rounded, gradient fill, white initials, 12px/600.
- **Table** — raised (`surface-raised`) uppercase 11px header row, 1px row dividers, `surface-hover` row hover.
- **Search / filter** — `.search-wrap` (32px left-padded input w/ icon), `.filter-btn` (bordered, chevron divider).
- **Tabs** — `.acct-tabs` underline style: 2px brand underline on active, count pill badge.
- **Sidebar / header** — see layout metrics above; profile trigger is a bordered pill with avatar + name + chevron.

## 7. Icons

Ported the **exact** icon set from `libs/shared/icons/src/lib/icons` into `components/icons/` (49 files, barrel-exported from `components/icons/index.ts`). These are solid/duotone `currentColor` SVG React components (mostly 20–24px viewBox), not an outline icon font.

```tsx
import { IconMenuUsers, IconSearch, IconLogout } from "@/components/icons"

<IconMenuUsers className="h-4 w-4" />
```

**Migration note:** this project currently renders icons via the Tabler webfont (`<i className="ti ti-plus" />`, loaded from a CDN in `app/layout.tsx`). That does not exist in the real product and is being replaced page-by-page with the ported icon components above. `lucide-react` (already installed via the shadcn CLI) stays available as a fallback only for one-off cases with no equivalent in the 49-icon set — prefer the ported set first for anything in a nav/header/table context so icon weight stays consistent with the rest of Cloud Alpha.

## 8. Implementation status

- [x] Tokens, font, radius, shadows, motion — `app/globals.css`
- [x] Icon set ported — `components/icons/`
- [x] Font loading — `app/layout.tsx` (Outfit via `next/font/google`)
- [x] Button / Badge / Input / Card primitives restyled
- [x] Sidebar + header shell restyled to 220/56px + 58px metrics
- [x] Full Tabler webfont → ported-icon swap across all pages (CDN link removed from `app/layout.tsx`); a few icons with no equivalent in the 49-icon set (`Eye`, `Cpu`, `Tag`, `Play`, `Rocket`, `PieChart`, `RefreshCw`) use `lucide-react` instead, per the fallback policy in §7
- [ ] Table, drawer, modal, wizard-step patterns — port on-demand as those screens are built (reference lives in `forms-panels.css` in the main repo for when needed)

### Corrections after side-by-side comparison against the live product (localhost:4200)

- **Header alignment**: sidebar's logo bar and the main `app-header` must both be exactly 58px — `SidebarHeader` previously had asymmetric `pt-[22px] pb-[18px]` padding that made it ~69px. Fixed to `h-[58px]` with centered content.
- **Table row hover**: the product uses a subtle **brand-tinted** wash (`bg-brand/5` light, `bg-brand/7` dark), not a neutral gray (`bg-muted`). Sidebar/nav hover correctly stays `surface-hover` (confirmed against the live app's stylesheet) — only data-table rows use the brand tint.
- **Stat card hover**: border goes to `border-strong` (neutral), not a brand-colored border.
- **Create Tenant**: no longer a route. The trigger button (`+ New Tenant`, brand-tinted `page-action--labeled` style) lives inside the Tenants page itself, top-right, and opens `components/tenant-create-drawer.tsx` — a right-side `AppDrawer` (`components/ui/app-drawer.tsx`) at the "wizard" width (`720px`, matches the live product's `--drawer-width-wizard`), backdrop `rgba(15,23,42,.35)` + `blur(2px)`, 56px header, scrollable body, sticky footer. A simple single-field drawer (matching the product's plain 440px "Create User" pattern) should use `size="default"` instead.
- **Theme toggle**: plain 32×32 icon button (`components/ui/mode-toggle.tsx`), no dropdown — click flips `light`/`dark` directly, matching the product's `.header-theme-btn`.

### Tailwind v4 opacity-modifier pitfall (`bg-brand/8` etc.)

`--color-brand` (and the other custom tokens) are defined as `rgb(var(--x))` — a CSS function, not a bare color. Tailwind v4's `/NN` opacity modifier on such a color synthesizes it via `color-mix(in oklab, …)`, which renders visibly darker/muddier than the product's plain `rgba(...)`. **Never use a `/NN` opacity modifier on `brand`/`success`/`warning`/`error`/`info`.** Use a plain-rgba component class instead — see `.page-action--labeled` and `.row-hover-brand` in `app/globals.css` for the pattern (`background: rgb(var(--brand-rgb) / 0.08)`), and reuse them rather than reinventing inline.

### Arbitrary-value color pitfall (`text-[var(--x)]`, `border-[var(--x)]`)

Several tokens (`--text-primary`, `--text-secondary`, `--text-tertiary`, `--border-strong`, `--border-default`, `--border-subtle`, `--border-focus`, `--border-input`, `--brand-rgb`, …) are declared as **bare RGB triplets** (e.g. `--border-strong: 196 205 215;`), meant only to be wrapped in `rgb(...)`. Using one of these directly as `text-[var(--border-strong)]` or `border-[var(--border-strong)]` is invalid at computed-value time — the browser silently falls back to `currentColor`, which either does nothing visible (text case) or produces a jarring wrong-colored border (this caused the "very thick border" stat-card hover bug). **Always use the registered Tailwind utility instead** (`border-border-strong`, `text-foreground`, `text-muted-foreground`, `text-tertiary`, …) — never reference these bare tokens directly in an arbitrary-value bracket.

### `text-primary`/`text-secondary` naming collision (recurring — check every new file)

`text-primary` and `text-secondary` are shadcn-claimed keys (`--color-primary` = brand blue, `--color-secondary` = surface-raised background) — **not** neutral text colors, despite the reference product's own CSS using those exact class names for neutral text (its Tailwind config has no such collision). Copying the reference's literal class names verbatim into this app silently miscolors text (brand-blue name labels, near-invisible secondary text) twice already in this project (sidebar nav, then `profile-menu.tsx`). Always translate: `text-primary` → `text-foreground`, `text-secondary` → `text-muted-foreground`. `text-tertiary`/`text-disabled` are safe as-is (no collision).

### Legacy variable compatibility

Pages already in this repo (`tenants/page.tsx`, `tenants/new/page.tsx`, `tenant-detail-content.tsx`, `deployment/page.tsx`, `login/page.tsx`) reference an older, informally-named variable set directly (`var(--bg2)`, `var(--text3)`, `var(--green-bg)`, `var(--accent)`, etc.) from before this token rewrite. Rather than rewrite every call site, `app/globals.css` re-declares those exact names as aliases onto the new Cloud Alpha tokens (see the "Legacy … aliases" comments in both `:root` and `.dark`) — so existing pages render with the correct new palette without modification. New code should use the real token names/utilities in §2–§6 instead of these aliases.
