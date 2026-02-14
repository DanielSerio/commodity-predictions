# Code Audit: `feat/foundation` Branch

**Date:** 2026-02-13
**Reviewer:** Claude Opus 4.6
**Scope:** All changes on `feat/foundation` vs `origin/master` (1 commit: `9806458 milestone: phase 1`)
**Files changed:** 26 (+1,185 / -262 lines)

---

## Summary

This branch introduces the foundational UI layer for the Commodity Predictions app: a sidebar layout shell (shadcn `Sidebar`), a dashboard page, a commodities list page with `@tanstack/react-table`, a commodity detail page with a Recharts price chart, a database seed script, and various styling customizations to shadcn primitives. It also fixes a typo in the `lib/utlis` directory name (renamed to `lib/utils`).

---

## Critical Issues

### 1. `sqlite.db-shm` committed to version control

**File:** `sqlite.db-shm`
**Severity:** Critical

The SQLite shared-memory file (`sqlite.db-shm`) is a binary runtime artifact that should never be committed. The `.gitignore` covers `sqlite.db`, `sqlite.db-journal`, and `sqlite.db-wal` but is missing `sqlite.db-shm`. This file will cause merge conflicts and pollute the repository.

**Fix:** Add `sqlite.db-shm` to `.gitignore` and remove it from tracking with `git rm --cached sqlite.db-shm`.

### 2. Missing unique constraint on `commodities.slug`

**File:** `lib/db/schema.ts:10`
**Severity:** Critical

The `slug` column on the `commodities` table is defined as `text("slug").notNull()` but lacks a `.unique()` constraint. Since `getCommodityBySlug()` uses `.get()` (returns a single row), duplicate slugs would silently return an arbitrary match. The `models` and `jobStatus` tables correctly apply `.unique()` to their slug columns.

**Fix:** Add `.unique()` to the `commodities.slug` column definition.

---

## High-Severity Issues

### 3. Component files exceed 100-line limit

**Convention:** CLAUDE.md: "Component files should always be under 100 lines."

| File | Lines |
|---|---|
| `features/commodities/components/commodity-list.tsx` | 168 |
| `features/commodities/pages/commodity-detail-page.tsx` | 158 |
| `features/commodities/components/price-chart.tsx` | 132 |
| `features/predictions/pages/dashboard-page.tsx` | 112 |
| `components/layout/app-sidebar.tsx` | 123 |

**Fix:** Extract sub-components. For example, `commodity-detail-page.tsx` could extract the metadata card, the AI insights card, and the stat cards into separate files. The column definitions in `commodity-list.tsx` could be extracted to a `use-commodity-columns.ts` hook (column definition hooks are explicitly exempt from the 100-line rule).

### 4. Hardcoded values in dashboard

**File:** `features/predictions/pages/dashboard-page.tsx:5-34`
**Severity:** High

All dashboard statistics are hardcoded strings (`'5'`, `'0'`, `'4'`, `'Online'`). These values will become stale immediately and mislead users. The "Ollama Engine" section also hardcodes "4 models" and "Llama 3.2 Connected".

**Fix:** Fetch these values from the database or backend. At minimum, query the commodity and model counts dynamically.

### 5. Hardcoded stale strings in commodity detail

**File:** `features/commodities/pages/commodity-detail-page.tsx:80-95`
**Severity:** High

- `"Last synced 14 minutes ago"` is a static string that will never update.
- `"MetalPrice API"` is hardcoded as the data source, but there is no evidence this API is actually integrated.
- `"Tracking 24/7 global spot prices"` and `"Active"` market status are static placeholders.

These give users a false impression of live data.

**Fix:** Either remove these placeholder cards or clearly label them as placeholders/coming-soon.

### 6. Imports placed after code in `layout.tsx`

**File:** `app/layout.tsx:14-18`
**Severity:** High (convention violation)

Imports for `SidebarProvider`, `AppSidebar`, `TooltipProvider`, `ThemeProvider`, and `SiteHeader` appear after the font variable declarations. All imports should be grouped at the top of the file per standard convention.

---

## Medium-Severity Issues

### 7. Sidebar navigation links to non-existent routes

**File:** `components/layout/app-sidebar.tsx:48-87`
**Severity:** Medium

The sidebar has links to `/predictions`, `/models`, `/analysis`, `/settings/models`, and `/settings/calibration`, but none of these routes have corresponding page files. Users clicking these links will see a 404.

**Fix:** Either create stub pages for these routes, or disable/hide the links until the pages exist.

### 8. Modified shadcn/ui primitives make upgrades difficult

**Files:** `components/ui/card.tsx`, `components/ui/sidebar.tsx`
**Severity:** Medium

The `Card` component's default styles were changed from `bg-card` to `bg-card/40 backdrop-blur-xl` with custom border and shadow overrides. Similarly, `Sidebar` internals changed from `bg-sidebar` to `bg-sidebar/40 backdrop-blur-xl` and `SidebarInset` from `bg-background` to `bg-transparent`.

These modifications are embedded directly in the shadcn primitives rather than applied via wrapper components or className overrides at the usage site. Future `shadcn/ui` upgrades will conflict with these changes.

**Recommendation:** Create wrapper components (e.g., `GlassCard`) that apply the glassmorphism styling on top of the unmodified shadcn primitives.

### 9. `bg-zinc-950` hardcoded on body instead of using theme variable

**File:** `app/globals.css:102`
**Severity:** Medium

The body background was changed from `bg-background` (which respects the theme CSS variable) to `bg-zinc-950` (a hardcoded Tailwind color). Even though dark mode is currently forced, this breaks the theming contract and will cause issues if light mode support is ever added.

**Fix:** Revert to `bg-background` and define the desired background color via the `--background` CSS variable.

### 10. Background animation blobs may cause performance issues

**File:** `app/layout.tsx:34-39`
**Severity:** Medium

Six absolutely-positioned `div` elements with large `blur` values (90-140px) and CSS animations (`animate-pulse`, `animate-bounce`) are rendered on every page. Large blur radii are GPU-intensive and can cause jank on lower-end devices or when the page has complex content.

**Recommendation:** Consider using `will-change: transform` or reducing the number of blobs. Test on lower-end hardware. Consider using `prefers-reduced-motion` media query to disable these for accessibility.

### 11. No `data-testid` attributes anywhere

**Convention:** CLAUDE.md: "Always use testid selectors for testing."
**Severity:** Medium

None of the new components include `data-testid` attributes. This will make future Playwright/Storybook testing difficult.

---

## Low-Severity Issues

### 12. Seed script uses double quotes inconsistently

**File:** `scripts/seed.ts`
**Severity:** Low

The seed script uses double quotes throughout while the rest of the codebase has been normalized to single quotes. Minor inconsistency.

### 13. `ThemeProvider` wrapper adds unnecessary complexity

**File:** `components/theme-provider.tsx`
**Severity:** Low

The `ThemeProvider` is configured with `defaultTheme="dark"` and `forcedTheme="dark"`, meaning theme switching is disabled. The wrapper component, `next-themes` dependency, and `suppressHydrationWarning` on `<html>` add complexity for a feature that is intentionally disabled.

**Recommendation:** If dark mode is the only supported theme, the `ThemeProvider` can be removed entirely and `class="dark"` can be set directly on `<html>`.

### 14. `seed.ts` duplicates database connection logic

**File:** `scripts/seed.ts:5-6` vs `lib/db/index.ts`
**Severity:** Low

The seed script creates its own `Database` and `drizzle` instance rather than importing from `@/lib/db`. This duplicates configuration (e.g., the seed script doesn't enable WAL mode or foreign keys).

**Fix:** Import the shared `db` instance from `@/lib/db`.

### 15. `PriceChart` uses `hsl(var(--primary))` but theme uses `oklch`

**File:** `features/commodities/components/price-chart.tsx:47,51,78,97`
**Severity:** Low

The chart references `hsl(var(--primary))` and `hsl(var(--muted-foreground))`, but the CSS variables in `globals.css` are defined using `oklch()` color space. These `hsl()` references will not resolve correctly and chart colors will likely be wrong or invisible.

**Fix:** Use `oklch(var(--primary))` or extract the color values via CSS `color-mix()` / JS.

### 16. `commodity-list.tsx` sidebar active state uses exact match

**File:** `components/layout/app-sidebar.tsx:98`
**Severity:** Low

`isActive={pathname === item.url}` uses strict equality. Visiting `/commodities/gold` won't highlight the "Commodities" nav item. Consider using `pathname.startsWith(item.url)` (with special-casing for `/` to avoid matching everything).

---

## Positive Observations

- Clean feature-module file structure (`features/commodities/`, `features/predictions/`).
- Good separation between app routes (thin) and feature pages (contain logic).
- Repository pattern for data access is consistent and well-organized.
- `onConflictDoNothing()` in seed script prevents duplicate insert errors.
- Proper use of Next.js `notFound()` for missing commodities.
- `lib/utlis` typo correctly renamed to `lib/utils`.
- Consistent use of the `cn()` utility for className composition.
