import type { TooltipProps } from 'recharts';

type PriceChartTooltipProps = TooltipProps<number, string>;

export function PriceChartTooltip({
  active,
  payload,
  label,
}: PriceChartTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-3 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in duration-200">
        <p className="text-sm font-bold text-muted-foreground mb-1">{label}</p>
        <p className="text-lg font-extrabold text-primary">
          ${payload[0].value}
        </p>
      </div>
    );
  }
  return null;
}
