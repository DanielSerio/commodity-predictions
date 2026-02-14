import { getPredictionById } from '@/repositories/predictions';
import { getCommodityById } from '@/repositories/commodities';
import { getModelById } from '@/repositories/models';
import { PredictionReviewForm } from '@/features/predictions/components/prediction-review-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ForecastCard } from '../components/forecast-card';
import { TargetDateCard } from '../components/target-date-card';

export async function PredictionDetailPage({
  predictionId,
}: {
  predictionId: number;
}) {
  const prediction = await getPredictionById(predictionId);
  if (!prediction) notFound();

  const commodity = await getCommodityById(prediction.commodityId);
  const model = await getModelById(prediction.modelId);

  return (
    <div
      className="flex flex-col gap-8 p-10 max-w-5xl mx-auto"
      data-testid="prediction-detail-page"
    >
      <div className="flex flex-col gap-6">
        <Button
          asChild
          variant="ghost"
          className="w-fit -ml-4"
          data-testid="back-button"
        >
          <Link href="/predictions">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Predictions
          </Link>
        </Button>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-extrabold tracking-tight">
              Review Prediction
            </h1>
            <Badge
              variant="outline"
              className="font-mono bg-muted/50"
            >
              ID: {prediction.id}
            </Badge>
          </div>
          <p className="text-muted-foreground text-lg">
            Validate and adjust the forecast for{' '}
            <span className="text-foreground font-bold">{commodity?.name}</span>
            .
          </p>
        </div>
      </div>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
        <div className="space-y-6">
          <ForecastCard
            predictedPrice={prediction.predictedPrice}
            confidence={prediction.modelConfidence}
            modelName={model?.name || 'Unknown'}
          />
          <TargetDateCard date={prediction.predictionDate} />
        </div>

        <Card data-testid="human-insight-card">
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            <User className="h-5 w-5 text-blue-500" />
            <CardTitle>Human Insight</CardTitle>
          </CardHeader>
          <CardContent>
            <PredictionReviewForm
              predictionId={prediction.id}
              initialData={{
                predictedPrice: prediction.predictedPrice,
                modelConfidence: prediction.modelConfidence,
                humanPredictedPrice: prediction.humanPredictedPrice,
                humanConfidence: prediction.humanConfidence,
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
