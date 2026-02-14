# Code Audit: `feat/prediction-lifecycle` Branch

**Date:** 2026-02-14
**Reviewer:** Claude Opus 4.6
**Scope:** All changes on `feat/prediction-lifecycle` vs `main` (1 commit: `f6da468 milestone: prediction lifecycle`)
**Files changed:** 13 (+761 / -53 lines)

---

## Summary

This branch implements Phase 2 of the roadmap — the prediction lifecycle. It adds: an Ollama integration service for LLM-based commodity forecasts, a prediction job runner, a predictions list page with a TanStack Table, a prediction detail/review page, and a "Trigger Forecast Job" button on the dashboard. The repository layer was extended with join queries and aggregate counts. The ROADMAP.md was updated to mark Phase 1-2 items as complete.

---

## Critical Issues

### 1. Review form does not persist data

**File:** `features/predictions/components/prediction-review-form.tsx:32-51`
**Severity:** Critical

The `handleSave` function — the core feature of this branch — does not call a server action or API route. It logs to the console and fakes a save with `setTimeout(resolve, 800)`. The `toast.success` message ("Review saved and saved to prediction history") is misleading because nothing is written to the database. The `updatePrediction` repository function exists but is never wired up.

**Fix:** Create a server action (e.g., `updatePredictionReviewAction`) that calls `updatePrediction(id, { humanPredictedPrice, humanConfidence })` and invoke it from the form.

### 2. Prediction detail page violates the thin-routes convention

**File:** `app/predictions/[id]/page.tsx` (136 lines)
**Severity:** Critical (architectural)

This route file contains full page layout, data fetching, card components, and business logic. The project's core convention — documented in `ROUTING.md` and enforced across all other routes — is that `app/` files should be thin wrappers that import page components from `features/`. Every other route follows this pattern (`app/page.tsx` imports `DashboardPage`, `app/predictions/page.tsx` imports `PredictionsPage`, `app/commodities/[slug]/page.tsx` imports `CommodityDetailPage`).

**Fix:** Extract the contents to `features/predictions/pages/prediction-detail-page.tsx` and make the route file a one-line import.

---

## High-Severity Issues

### 3. Ollama service does not validate LLM response shape

**File:** `services/ollama.service.ts:48`
**Severity:** High

`JSON.parse(data.response)` trusts that the LLM returned a well-formed object with `predictedPrice`, `confidence`, and `rationale` fields. LLMs routinely produce malformed output, extra keys, missing fields, or values outside expected ranges. If the LLM returns `confidence: 150` or `predictedPrice: "high"`, those values flow directly into the database via `Number()` coercion (producing `NaN` or nonsensical values).

**Fix:** Validate with a Zod schema (already a project dependency via `drizzle-zod`):
```ts
const predictionSchema = z.object({
  predictedPrice: z.number().positive(),
  confidence: z.number().min(1).max(100),
  rationale: z.string(),
});
const result = predictionSchema.parse(JSON.parse(data.response));
```

### 4. Component files exceed 100-line limit

**Convention:** CLAUDE.md: "Component files should always be under 100 lines."

| File | Lines | Notes |
|---|---|---|
| `app/predictions/[id]/page.tsx` | 136 | Should be in `features/` (see issue #2) |
| `features/predictions/components/predictions-table.tsx` | 179 | Column defs should be in a `use-predictions-columns.ts` hook |
| `features/predictions/components/prediction-review-form.tsx` | 120 | Price input and confidence slider could be extracted |

Column definition hooks are explicitly exempt from the 100-line rule per CLAUDE.md, so extracting the column definitions from `predictions-table.tsx` into a hook would bring both files under the limit.

### 5. Model exclusion is hardcoded

**File:** `services/prediction.service.ts:14`
**Severity:** High

```ts
const models = (await getAllModels()).filter(m => m.name !== 'nomic-embed-text:latest');
```

The embedding model name is hardcoded as a string literal. If additional embedding models are registered, or the model name changes, predictions will silently run against inappropriate models. This is a brittle coupling between the service layer and specific seed data.

**Fix:** Add a boolean `isPredictionModel` column to the `models` table schema, or at minimum extract the exclusion list to a configuration constant.

### 6. Prediction job silently swallows failures and marks as "completed"

**File:** `services/prediction.service.ts:69-71`
**Severity:** High

When an individual prediction fails (inner `catch`), the error is logged but the loop continues and `processedCount` is still incremented. After the loop, the job is marked `completed` regardless of how many predictions actually succeeded. A job where 4 out of 5 predictions failed will still show 100% progress and "completed" status.

**Fix:** Track a failure count. If any predictions failed, either mark the job status as "partially_completed" or include error details in the job record. At minimum, do not report 100% success when items were skipped.

---

## Medium-Severity Issues

### 7. "Refresh Data" button is non-functional

**File:** `features/predictions/pages/predictions-page.tsx:24-30`
**Severity:** Medium

The "Refresh Data" button renders with no `onClick` handler. It is a static `<Button>` that does nothing when clicked. Users will expect this to refresh predictions data.

**Fix:** Either wire it to `router.refresh()` or remove it until functionality is implemented.

### 8. Typo in Ollama prompt

**File:** `services/ollama.service.ts:17`
**Severity:** Medium

"Analyize" should be "Analyze". This typo is sent to the LLM on every prediction call and may degrade prompt quality.

### 9. Repository functions called with `await` despite being synchronous

**File:** `services/prediction.service.ts:13-15`
**Severity:** Medium

```ts
const commodities = await getAllCommodities();
const models = (await getAllModels()).filter(...);
const statuses = await getAllJobStatuses();
```

All repository functions use `better-sqlite3`, which is synchronous. These functions return values directly, not Promises. The `await` is harmless (it no-ops on non-Promises) but misleading. It gives the impression these are asynchronous I/O calls, obscuring the actual execution model and making it harder to reason about concurrency.

**Fix:** Remove the `await` from synchronous repository calls. The only `await` in this service should be on `this.ollamaService.predict()`.

### 10. Target date computed inside the inner loop

**File:** `services/prediction.service.ts:58-59`
**Severity:** Medium

```ts
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
```

A new `Date()` is created for each model-commodity pair. If a job runs near midnight and crosses the date boundary, some predictions will target a different date than others within the same job. All predictions in a single job should target the same date.

**Fix:** Compute the target date once before the loops begin.

### 11. `Prediction` interface duplicates repository return type

**File:** `features/predictions/components/predictions-table.tsx:23-32`
**Severity:** Medium

The `Prediction` interface is manually defined to match the shape returned by `getAllPredictionsExtended()`. If the repository query changes (e.g., adding a field), this interface will silently drift. TypeScript provides `ReturnType` and `Awaited` utilities to infer types from functions.

**Fix:** Infer the type from the repository:
```ts
type Prediction = ReturnType<typeof getAllPredictionsExtended>[number];
```

### 12. No `data-testid` attributes on new interactive elements

**Convention:** CLAUDE.md: "Always use testid selectors for testing."
**Severity:** Medium

None of the new components include `data-testid`:
- `prediction-review-form.tsx` — price input, confidence slider, submit button
- `predictions-table.tsx` — table rows, review links
- `job-trigger-button.tsx` — trigger button
- `app/predictions/[id]/page.tsx` — page wrapper

The existing dashboard and ollama status card do use `data-testid`.

### 13. Further modifications to shadcn/ui `sidebar.tsx` primitive

**File:** `components/ui/sidebar.tsx` (3 hunks changed)
**Severity:** Medium

This continues the pattern flagged in the Phase 1 audit. The `sidebarMenuButtonVariants` and `SidebarMenuSubButton` were modified with custom active states (`data-active:bg-primary/10`, `data-active:border-primary/20`, `backdrop-blur-md`), hover states, and transition changes. These are embedded in the shadcn primitive rather than applied via wrapper components.

Each modification deepens the divergence from upstream shadcn/ui, making future upgrades increasingly difficult.

---

## Low-Severity Issues

### 14. `OllamaService` and `PredictionService` use classes while the rest of the codebase uses plain functions

**Files:** `services/ollama.service.ts`, `services/prediction.service.ts`
**Severity:** Low

The repository layer is entirely plain exported functions. The services layer uses classes with `new` instantiation. While the "no classes" rule in CLAUDE.md targets React components specifically, the inconsistency between layers is worth noting. The `PredictionService` constructor's default parameter (`new OllamaService()`) could be replaced with a simple function parameter with a default.

### 15. "System Operational" status is still hardcoded

**File:** `features/predictions/components/ollama-status-card.tsx:26-28`
**Severity:** Low

The Phase 1 audit flagged "Llama 3.2 Connected" as a hardcoded string. It has been replaced with "System Operational", which is still hardcoded. No health check against the Ollama API is performed.

### 16. `parseInt` without NaN guard on route parameter

**File:** `app/predictions/[id]/page.tsx:13`
**Severity:** Low

`parseInt(params.id)` returns `NaN` for non-numeric input. The query then passes `NaN` to `getPredictionById()`, which returns `undefined`, triggering `notFound()`. The end result is correct (user sees a 404), but the intent is unclear — an explicit guard like `Number.isNaN` before the query would make this a deliberate validation rather than an accidental fallthrough.

---

## Positive Observations

- Good use of `useTransition` in `JobTriggerButton` for non-blocking server action calls with proper loading states.
- `getAllPredictionsExtended()` is a well-structured join query that keeps the client component free of data-assembly logic.
- `getUnreviewedPredictionsCount()` correctly replaces the hardcoded `pendingReviews = 0` from Phase 1.
- The prediction job runner design (create job → update progress → mark complete) is a sound pattern for background processing.
- `OllamaStatusCard` now dynamically reflects the actual model count.
- Proper use of `revalidatePath` in the server action to refresh cached pages after job completion.
- The `PredictionReviewForm` UI is well-designed with a slider, reference to AI recommendation, and clear affordances.
