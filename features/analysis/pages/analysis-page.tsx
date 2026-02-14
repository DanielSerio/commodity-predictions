import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart } from 'lucide-react';

export function AnalysisPage() {
  return (
    <div className="flex flex-col gap-8 p-8" data-testid="analysis-page">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Analysis</h1>
        <p className="text-muted-foreground text-lg italic">
          Compare predictions against actual market outcomes.
        </p>
      </div>

      <Card className="border-dashed">
        <CardHeader className="flex flex-row items-center gap-2 space-y-0">
          <LineChart className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Analysis tools will be available once prediction data is generated.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
