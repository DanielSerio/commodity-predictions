# Commodity Predictions

A local human-in-the-loop (HITL) commodity price predictor. ML models generate price predictions, then you review and adjust them with your own confidence scores and price overrides before the actual prices come in.

## How It Works

1. **Models predict** — A prediction job runs one or more ML models against tracked commodities, producing a predicted price and model confidence score.
2. **You review** — Each prediction starts unreviewed. You can set your own confidence score and optionally override the predicted price.
3. **Actuals come in** — Once the real price is available, the delta between predicted and actual price is recorded for accuracy tracking.

## Data Model

The full schema is defined in [`docs/data.dbml`](docs/data.dbml). Key design decisions:

- **Single source of truth for prices** — Historical prices live in the `prices` table. Predictions store a `prediction_actual_delta` (predicted minus actual) rather than duplicating the actual price.
- **Nullable human fields** — `human_confidence` and `human_predicted_price` are null until reviewed, so unreviewed predictions are always distinguishable from reviewed ones.
- **Model registry** — Each prediction is linked to the model that produced it, enabling per-model accuracy comparisons.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Tech Stack

- [Next.js](https://nextjs.org) (App Router)
- [React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Recharts](https://recharts.org)
