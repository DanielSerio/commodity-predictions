'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';

interface TargetDateCardProps {
  date: Date;
}

export function TargetDateCard({ date }: TargetDateCardProps) {
  return (
    <Card
      className="bg-primary/5 border-primary/20"
      data-testid="target-date-card"
    >
      <CardHeader className="flex flex-row items-center gap-2 space-y-0 text-primary">
        <Target className="h-5 w-5" />
        <CardTitle>Target Date</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">
          {date.toLocaleDateString('en-US', {
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
  );
}
