import { notFound } from 'next/navigation';
import { getCommodityBySlug } from '@/repositories/commodities';
import { getPricesByCommodityId } from '@/repositories/prices';
import { PriceChart } from '../components/price-chart';
import { CommodityMetadataCard } from '../components/commodity-metadata-card';
import { AIInsightsCard } from '../components/ai-insights-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Info } from 'lucide-react';
import Link from 'next/link';
import { BackfillButton } from '../components/backfill-button';

interface CommodityDetailProps {
  slug: string;
}

export async function CommodityDetailPage({ slug }: CommodityDetailProps) {
  const commodity = await getCommodityBySlug(slug);

  if (!commodity) {
    notFound();
  }

  const prices = await getPricesByCommodityId(commodity.id);

  return (
    <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto" data-testid="commodity-detail-page">
      <div className="flex flex-col gap-6">
        <Button
          asChild
          variant="ghost"
          className="w-fit -ml-4 hover:bg-primary/10 transition-colors"
        >
          <Link href="/commodities">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Registry
          </Link>
        </Button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-5xl font-black tracking-tighter uppercase italic">
                {commodity.name}
              </h1>
              <Badge
                variant="secondary"
                className="text-lg px-3 py-1 font-mono tracking-widest bg-primary/20 text-primary border-primary/30"
              >
                {commodity.symbol}
              </Badge>
            </div>
            <p className="text-muted-foreground text-xl font-medium tracking-tight max-w-2xl">
              Historical analysis for{' '}
              <span className="text-foreground font-bold">
                {commodity.name}
              </span>{' '}
              markets.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 space-y-8">
          {prices.length > 0 ? (
            <PriceChart
              data={prices}
              commodityName={commodity.name}
            />
          ) : (
            <Card className="border-dashed">
              <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-medium">
                  No Price History
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  No historical price data exists for this commodity yet.
                  Backfill 30 days of closing prices from the MetalPrice API.
                </p>
                <BackfillButton
                  commodityId={commodity.id}
                  symbol={commodity.symbol}
                  slug={commodity.slug}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="flex flex-col gap-6">
          <CommodityMetadataCard
            slug={commodity.slug}
            id={commodity.id}
            createdAt={commodity.createdAt}
          />
          <AIInsightsCard
            commodityName={commodity.name}
            commodityId={commodity.id}
            slug={commodity.slug}
          />
        </div>
      </div>
    </div>
  );
}
