import { RefreshCcw } from 'lucide-react';
import { PredictionsTable } from '../components/predictions-table';
import { getAllPredictionsExtended } from '@/repositories/predictions';
import { Button } from '@/components/ui/button';

export async function PredictionsPage() {
  const predictions = await getAllPredictionsExtended();

  return (
    <div
      className="flex flex-col gap-8 p-10 max-w-7xl mx-auto"
      data-testid="predictions-page"
    >
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
            Predictions
          </h1>
          <p className="text-muted-foreground text-lg font-medium">
            Review and validate AI-generated forecasts for global commodities.
          </p>
        </div>

        <Button
          variant="outline"
          className="gap-2 rounded-full px-6 hover:bg-primary/5"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      <div className="grid gap-6">
        <PredictionsTable data={predictions} />
      </div>
    </div>
  );
}
