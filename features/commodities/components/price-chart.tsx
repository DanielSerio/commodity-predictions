'use client';

import {
  Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { format } from 'date-fns';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import { PriceChartTooltip } from './price-chart-tooltip';

interface PriceChartProps {
  data: { date: Date; price: number }[];
  commodityName: string;
}

export function PriceChart({ data, commodityName }: PriceChartProps) {
  const chartData = data.map((d) => ({
    date: format(d.date, 'MMM dd'),
    price: d.price,
  }));

  return (
    <Card className="col-span-4 overflow-hidden group" data-testid="price-chart">
      <CardHeader className="flex flex-col gap-2 border-b border-white/5 bg-gradient-to-r from-primary/5 to-transparent pb-6">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Price History
        </CardTitle>
        <CardDescription className="text-base">
          Historical closing prices for {commodityName}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[400px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="currentColor"
                className="text-muted-foreground/10"
              />
              <XAxis
                dataKey="date"
                stroke="currentColor"
                className="text-muted-foreground"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="currentColor"
                className="text-muted-foreground"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
                dx={-10}
              />
              <Tooltip content={PriceChartTooltip} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="currentColor"
                className="text-primary"
                strokeWidth={3}
                dot={false}
                activeDot={{
                  r: 6,
                  className: 'fill-primary stroke-background stroke-2 shadow-lg',
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
