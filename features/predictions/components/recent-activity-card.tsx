import { Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function RecentActivityCard() {
  return (
    <Card className="overflow-hidden h-full" data-testid="recent-activity-card">
      <CardHeader className="bg-primary/5 border-b border-white/5">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-12 flex flex-col items-center justify-center text-center">
        <div className="bg-primary/10 p-4 rounded-full mb-4">
          <Target className="h-8 w-8 text-primary opacity-50" />
        </div>
        <p className="text-muted-foreground font-medium">
          No recent predictions to show.
        </p>
        <p className="text-sm text-muted-foreground/60">
          Run a prediction job to see data here.
        </p>
      </CardContent>
    </Card>
  );
}
