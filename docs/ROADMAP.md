# Project Roadmap: Commodity Predictions MVP

This roadmap outlines the path to a Minimum Viable Product (MVP) for the Commodity Predictions platform. The goal is a functional HITL (Human-in-the-Loop) system where AI model predictions are curated by human expertise.

## Phase 1: Core Foundation & Data Management

**Goal**: Establish the data access layer and the basic commodity registry.

- [x] **Database Repositories**: Complete the `repositories/` layer with Drizzle-based CRUD operations for all tables (`commodities`, `predictions`, `models`, etc.).
- [x] **Seed System**: Create a robust seeding script to populate initial commodities (Gold, Silver, Copper) and ML engine definitions.
- [x] **Commodity Registry (`/commodities`)**:
  - [x] Implement the list view using TanStack Table with server-side sorting.
  - [x] Build the `/commodities/[slug]` detail page with a historical price chart (Recharts).
- [x] **Global Navigation**: Implement a premium sidebar using `shadcn/ui` based on the `ROUTING.md` specification.

## Phase 2: The Prediction Lifecycle (Internal)

**Goal**: Generate AI predictions and build the human review interface.

- [x] **Ollama Integration Service**:
  - [x] Set up the service layer to prompt local Ollama models (e.g., Llama 3) for price forecasts.
  - [x] Implement the prompt engineering logic for model confidence scores.
- [x] **Prediction Job Runner**: Create the logic to trigger prediction jobs across all tracked commodities.
- [x] **Review Workspace (`/predictions`)**:
  - [x] Build the "Active Predictions" list focusing on "Unreviewed" items.
  - [x] Implement the `/predictions/[id]` detail view where humans can set `human_confidence` and `human_predicted_price` overrides.

## Phase 3: Closing the Loop (Actuals)

**Goal**: Fetch real-world price data to validate predictions.

- [ ] **MetalPrice API Adapter**: Implement the adapter to fetch actual daily closing prices for commodities.
- [ ] **The "Actualizer" Job**:
  - [ ] Create a background process that checks for predictions whose `prediction_date` has passed.
  - [ ] Fetch the actual price, populate the `prices` table, and calculate the `prediction_actual_delta`.
- [ ] **Notification System**: Add subtle UI indicators (Sonner) when new "Actuals" are processed and accuracy scores are updated.

## Phase 4: Analysis & Performance Dashboards

**Goal**: Visualize accuracy and model performance.

- [ ] **Analysis Hub (`/analysis`)**:
  - [ ] Build charts comparing **Model Confidence vs. Actual Delta**.
  - [ ] Build charts comparing **Human Accuracy vs. Model Accuracy** to prove the value of the HITL approach.
- [ ] **Model Performance Dashboard (`/models`)**:
  - [ ] Implement the comparison table for all ML models.
  - [ ] Create `/models/[slug]` to show per-model calibration curves and historical error rates (MAE/RMSE).

## Phase 5: MVP Polish & Optimization

**Goal**: Premium aesthetics and production readiness.

- [ ] **Aesthetic Refinement**:
  - [ ] Implement a cohesive Dark Mode design with glassmorphism touches.
  - [ ] Add micro-animations for data loading and form submissions.
- [ ] **Performance Tuning**:
  - [ ] Optimize Drizzle queries for large datasets.
  - [ ] Ensure all table interactions (filtering/sorting) remain snappy with server-side processing.
- [ ] **Final QA**: End-to-end testing of the prediction -> review -> actualization lifecycle.
