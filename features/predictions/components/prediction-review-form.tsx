'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface PredictionReviewFormProps {
  predictionId: number;
  initialData: {
    predictedPrice: number | null;
    modelConfidence: number;
    humanPredictedPrice: number | null;
    humanConfidence: number | null;
  };
}

export function PredictionReviewForm({
  predictionId,
  initialData,
}: PredictionReviewFormProps) {
  const [price, setPrice] = React.useState(
    initialData.humanPredictedPrice ?? initialData.predictedPrice ?? 0,
  );
  const [confidence, setConfidence] = React.useState(
    initialData.humanConfidence ?? 50,
  );
  const [loading, setLoading] = React.useState(false);

  async function handleSave() {
    setLoading(true);
    try {
      // API call placeholder
      console.log('Saving review for prediction', predictionId, {
        humanPredictedPrice: price,
        humanConfidence: confidence,
      });

      // In a real implementation, we would use a Server Action or API route here.
      // E.g., await updatePredictionAction(predictionId, { humanPredictedPrice: price, humanConfidence: confidence });

      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success('Review saved and saved to prediction history');
    } catch {
      toast.error('Failed to save review');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-6">
        <div className="space-y-3">
          <Label
            htmlFor="price"
            className="text-sm font-bold uppercase tracking-widest text-muted-foreground"
          >
            Adjusted Price Forecast
          </Label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-mono text-muted-foreground group-focus-within:text-primary transition-colors">
              $
            </span>
            <Input
              id="price"
              type="number"
              step="0.01"
              className="pl-10 h-16 text-3xl font-mono font-black border-2 focus-visible:ring-offset-0 focus-visible:ring-primary/20"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            AI recommended:{' '}
            <span className="font-mono font-bold text-emerald-500">
              ${initialData.predictedPrice?.toFixed(2)}
            </span>
          </p>
        </div>

        <div className="space-y-5">
          <div className="flex justify-between items-end">
            <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Human Confidence Level
            </Label>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black font-mono text-primary">
                {confidence}
              </span>
              <span className="text-sm font-bold text-muted-foreground">%</span>
            </div>
          </div>
          <Slider
            min={0}
            max={100}
            step={1}
            value={[confidence]}
            onValueChange={(vals) => setConfidence(vals[0])}
            className="py-4"
          />
          <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
            <span>Speculative</span>
            <span>Certain</span>
          </div>
        </div>
      </div>

      <Button
        className="w-full h-14 text-xl font-black uppercase tracking-tighter shadow-2xl shadow-primary/30 transition-all active:scale-95 disabled:grayscale"
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? 'Committing...' : 'Confirm Review'}
      </Button>
    </div>
  );
}
