# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run db:push      # Push schema changes to SQLite via Drizzle Kit
npm run db:studio    # Open Drizzle Studio visual editor
npm run db:seed      # Seed database (npx tsx scripts/seed.ts)
```

## Architecture

**Human-in-the-loop commodity price predictor.** ML models (via local Ollama) generate price predictions for tracked commodities, humans review and optionally override them, then actual prices come in to measure accuracy.

### Feature-First Module Structure

The `app/` directory is a **thin routing layer only** — all business logic lives in `features/`:

```
app/predictions/page.tsx          → imports from features/predictions/pages/
features/predictions/pages/       → page components (async server components)
features/predictions/components/  → feature-specific components
features/predictions/hooks/       → feature-specific hooks (optional)
```

### Layers

- **`repositories/`** — Data access layer. One file per entity with Drizzle ORM queries. All database access goes through here.
- **`services/`** — External integrations. `ollama.service.ts` handles LLM calls, `prediction.service.ts` orchestrates prediction job lifecycle.
- **`lib/db/schema.ts`** — Single file defining all Drizzle ORM tables and Zod schemas (via `drizzle-zod`).
- **`components/ui/`** — shadcn/ui primitives. `components/layout/` has app shell (sidebar, header).
- **`hooks/`** — Shared React hooks.

### Database

SQLite (`sqlite.db`) with Drizzle ORM. Schema changes go through `lib/db/schema.ts` then `npm run db:push`.

Key tables: `commodities`, `prices`, `models`, `job_status`, `jobs`, `predictions`.

Design decisions:
- `predictions.human_confidence` and `human_predicted_price` are **nullable** — null means unreviewed.
- `prediction_actual_delta` stores predicted minus actual (null until actual price arrives).
- Jobs track progress via `totalItems`, `processedItems`, and `progress` percentage.

### Routing

See [docs/ROUTING.md](docs/ROUTING.md) for the full route map. Key routes:
- `/` — Dashboard
- `/predictions` and `/predictions/[id]` — List and review predictions
- `/commodities` and `/commodities/[slug]` — Commodity registry and detail
- `/models` — Model comparison
- `/settings/*` — Configuration (models, calibration, jobs)

### Tech Stack Notes

- **Next.js 16** (App Router, React Server Components)
- **React 19** — functional components only, no classes
- **Tailwind CSS 4** with shadcn/ui (radix-mira style, zinc base color)
- **TanStack React Table** for data tables with server-side sorting
- **Recharts** for data visualization
- **Zod 4** for runtime validation, integrated via `drizzle-zod`
- **Ollama** for local LLM inference (the app calls a local Ollama server)

### Roadmap

Phases 1-2 are complete (data layer, commodity registry, prediction lifecycle, Ollama integration, review UI). Phases 3-5 are pending (actuals integration via MetalPrice API, analysis dashboards, polish). See [docs/ROADMAP.md](docs/ROADMAP.md).
