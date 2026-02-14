import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';

export function PredictionsPage() {
  return (
    <div className="flex flex-col gap-8 p-8" data-testid="predictions-page">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Predictions</h1>
        <p className="text-muted-foreground text-lg italic">
          Review and manage AI-generated commodity price predictions.
        </p>
      </div>

      <Card className="border-dashed">
        <CardHeader className="flex flex-row items-center gap-2 space-y-0">
          <Target className="h-5 w-5 text-muted-foreground" />
          <CardTitle>No Predictions Yet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Run a prediction job from the dashboard to generate forecasts.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
