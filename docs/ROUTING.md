# Routing Architecture

This document outlines the routing structure and conventions for the Commodity Predictions application.

## Overview

The application utilizes **Next.js 16 (App Router)** for its routing system. We follow a **Feature-First Architecture**, where the actual page logic is encapsulated within feature modules, and the `app` directory serves as a thin routing layer.

## Directory Structure

- `app/`: Routing entry points and global layouts.
- `features/[feature]/pages/`: Actual React components representing the pages.
- `features/[feature]/components/`: Components specific to that feature.

## Route Map

The following table defines the primary routes within the application:

| Path                  | Feature       | Description                                                                                |
| :-------------------- | :------------ | :----------------------------------------------------------------------------------------- |
| `/`                   | `predictions` | **Dashboard**: Overview of recent predictions, accuracy metrics, and quick actions.        |
| `/predictions`        | `predictions` | **Prediction List**: Search and filter all predictions.                                    |
| `/predictions/[id]`   | `predictions` | **Prediction Detail**: View model breakdown and perform human review/overrides.            |
| `/commodities`        | `commodities` | **Commodity List**: Browse tracked commodities and high-level trends.                      |
| `/commodities/[slug]` | `commodities` | **Commodity Detail**: Detailed historical price charts and commodity-specific metadata.    |
| `/models`             | `settings`    | **Model Comparison**: High-level performance overview of all active ML models.             |
| `/models/[slug]`      | `settings`    | **Model Performance Detail**: Specific accuracy metrics, calibration charts, and history.  |
| `/analysis`           | `predictions` | **Analysis & History**: Audit log of human reviews, accuracy metrics, and price overrides. |

### Settings & Configuration

Settings are grouped under `/settings` and provide granular control over the application's engine.

| Path                    | Description                                                             |
| :---------------------- | :---------------------------------------------------------------------- |
| `/settings/models`      | Configure ML model parameters, active states, and integration settings. |
| `/settings/calibration` | Adjust model calibration curves and human confidence weightings.        |
| `/settings/jobs`        | Monitor background job status, progress, and history.                   |

## Implementation Pattern

To maintain a clean separation of concerns, we avoid placing business logic or complex UI directly in `app/*.tsx`. Instead, we import page components from the `features` directory.

### Example: `/settings/models`

**1. Create the Page Component**
`features/settings/pages/models-settings-page.tsx`

```tsx
export function ModelsSettingsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold">Model Settings</h1>
      {/* Feature logic here */}
    </div>
  );
}
```

**2. Define the App Route**
`app/settings/models/page.tsx`

```tsx
import { ModelsSettingsPage } from '@/features/settings/pages/models-settings-page';

export default function Page() {
  return <ModelsSettingsPage />;
}
```

## Conventions

- **Thin Routes**: Keep `app/page.tsx` files minimal.
- **Route Groups**: Use parenthetical directories (e.g., `(dashboard)`) to group routes without affecting the URL path if needed.
- **Layouts**: Use `layout.tsx` at the appropriate level to share UI (like sidebars and navigation) across sub-routes.
- **Server-Side Operations**: As per project principles, all column filters and sorting should be implemented as server-side operations, triggered by URL state or API calls.
