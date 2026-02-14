'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { runCommodityPredictionAction } from '@/app/actions';

interface PredictButtonProps {
  commodityId: number;
  slug: string;
}

export function PredictButton({ commodityId, slug }: PredictButtonProps) {
  const [isPending, startTransition] = React.useTransition();

  const handlePredict = () => {
    startTransition(async () => {
      toast.info('Running AI prediction models...');
      const result = await runCommodityPredictionAction(commodityId, slug);

      if (result.success) {
        toast.success('Predictions generated successfully!');
      } else {
        toast.error(result.error ?? 'Failed to generate predictions.');
      }
    });
  };

  return (
    <Button
      variant="secondary"
      className="w-full font-bold shadow-lg gap-2"
      onClick={handlePredict}
      disabled={isPending}
      data-testid="predict-button"
    >
      {isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Running Models...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          Run Prediction
        </>
      )}
    </Button>
  );
}
