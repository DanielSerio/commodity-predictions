import { TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PredictButton } from './predict-button';

interface AIInsightsCardProps {
  commodityName: string;
  commodityId: number;
  slug: string;
}

export function AIInsightsCard({ commodityName, commodityId, slug }: AIInsightsCardProps) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-foreground p-8 text-primary-foreground shadow-xl relative overflow-hidden group" data-testid="ai-insights-card">
      <div className="relative z-10 flex flex-col gap-3">
        <h3 className="text-xl font-bold mb-1">AI Insights</h3>
        <p className="text-sm text-primary-foreground/80 leading-relaxed">
          Generate next-day price predictions for {commodityName} using all
          registered models.
        </p>
        <PredictButton commodityId={commodityId} slug={slug} />
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
