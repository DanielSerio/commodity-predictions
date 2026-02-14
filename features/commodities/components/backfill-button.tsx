'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { backfillCommodityHistoryAction } from '@/app/actions';

interface BackfillButtonProps {
  commodityId: number;
  symbol: string;
  slug: string;
}

export function BackfillButton({ commodityId, symbol, slug }: BackfillButtonProps) {
  const [isPending, startTransition] = React.useTransition();

  const handleBackfill = () => {
    startTransition(async () => {
      toast.info('Fetching historical price data from MetalPrice API...');
      const result = await backfillCommodityHistoryAction(commodityId, symbol, slug);

      if (result.success) {
        toast.success(`Backfilled ${result.count} days of price history.`);
      } else {
        toast.error(result.error ?? 'Failed to backfill price data.');
      }
    });
  };

  return (
    <Button
      onClick={handleBackfill}
      disabled={isPending}
      className="gap-2"
      data-testid="backfill-button"
    >
      {isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Fetching History...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Backfill History
        </>
      )}
    </Button>
  );
}
