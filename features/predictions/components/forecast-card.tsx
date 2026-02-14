'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu } from 'lucide-react';

interface ForecastCardProps {
  predictedPrice: number | null;
  confidence: number;
  modelName: string;
}

export function ForecastCard({
  predictedPrice,
  confidence,
  modelName,
}: ForecastCardProps) {
  return (
    <Card data-testid="ai-forecast-card">
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
              ${predictedPrice?.toFixed(2)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
              Model Confidence
            </p>
            <p className="text-3xl font-mono font-bold">{confidence}%</p>
          </div>
        </div>
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-2">
            Model
          </p>
          <code className="text-xs bg-muted p-2 rounded block">
            {modelName}
          </code>
        </div>
      </CardContent>
    </Card>
  );
}
