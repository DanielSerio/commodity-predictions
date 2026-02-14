import { TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface AIInsightsCardProps {
  commodityName: string;
}

export function AIInsightsCard({ commodityName }: AIInsightsCardProps) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-foreground p-8 text-primary-foreground shadow-xl relative overflow-hidden group" data-testid="ai-insights-card">
      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-2">AI Insights</h3>
        <p className="text-sm text-primary-foreground/80 leading-relaxed mb-4">
          Predictive models for {commodityName} are currently in the calibration
          phase.
        </p>
        <Button
          variant="secondary"
          className="w-full font-bold shadow-lg"
          asChild
        >
          <Link href="/predictions">View Predictions</Link>
        </Button>
      </div>
      <div className="absolute -right-8 -bottom-8 opacity-10 transition-transform group-hover:scale-110 duration-500">
        <TrendingUp size={160} />
      </div>
    </div>
  );
}
