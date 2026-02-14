import { notFound } from 'next/navigation';
import { getPredictionById } from '@/repositories/predictions';
import { getCommodityById } from '@/repositories/commodities';
import { getModelById } from '@/repositories/models';
import { PredictionReviewForm } from '@/features/predictions/components/prediction-review-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target, Cpu, User } from 'lucide-react';
import Link from 'next/link';

export default async function Page({ params }: { params: { id: string } }) {
  const prediction = await getPredictionById(parseInt(params.id));

  if (!prediction) {
    notFound();
  }

  const commodity = await getCommodityById(prediction.commodityId);
  const model = await getModelById(prediction.modelId);

  return (
    <div className="flex flex-col gap-8 p-10 max-w-5xl mx-auto">
      <div className="flex flex-col gap-6">
        <Button
          asChild
          variant="ghost"
          className="w-fit -ml-4 hover:bg-primary/10 transition-colors"
        >
          <Link href="/predictions">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Predictions
          </Link>
        </Button>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-extrabold tracking-tight">
              Review Prediction
            </h1>
            <Badge
              variant="outline"
              className="font-mono uppercase tracking-widest bg-muted/50"
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
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 space-y-0">
              <Cpu className="h-5 w-5 text-primary" />
              <CardTitle>AI Forecast</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                    Predicted Price
                  </p>
                  <p className="text-3xl font-mono font-bold text-emerald-500">
                    ${prediction.predictedPrice?.toFixed(2)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                    Model Confidence
                  </p>
                  <p className="text-3xl font-mono font-bold">
                    {prediction.modelConfidence}%
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-2">
                  Model
                </p>
                <code className="text-xs bg-muted p-2 rounded block">
                  {model?.name}
                </code>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 text-primary">
              <Target className="h-5 w-5" />
              <CardTitle>Target Date</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {prediction.predictionDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                The date this price forecast is targeting.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
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
    </div>
  );
}
