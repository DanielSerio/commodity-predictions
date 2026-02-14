'use server';

import { runPredictionJob } from '@/services/prediction.service';
import { fetchHistoricalPrices, getBackfillDateRange } from '@/services/metalprice.service';
import { revalidatePath } from 'next/cache';
import { updatePrediction } from '@/repositories/predictions';
import { createPrice } from '@/repositories/prices';
import { getCommodityById } from '@/repositories/commodities';

export async function runPredictionJobAction() {
  try {
    await runPredictionJob();
    revalidatePath('/predictions');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Action failed:', error);
    return { success: false, error: 'Failed to run prediction job' };
  }
}

export async function updatePredictionAction(
  id: number,
  data: { humanPredictedPrice: number; humanConfidence: number; }
) {
  try {
    await updatePrediction(id, {
      ...data,
      updatedAt: new Date(),
    });
    revalidatePath(`/predictions/${id}`);
    revalidatePath('/predictions');
    return { success: true };
  } catch (error) {
    console.error('Update action failed:', error);
    return { success: false, error: 'Failed to update prediction' };
  }
}

export async function backfillCommodityHistoryAction(
  commodityId: number,
  symbol: string,
  slug: string,
) {
  try {
    const commodity = getCommodityById(commodityId);
    if (!commodity) {
      return { success: false, error: 'Commodity not found' };
    }

    const { startDate, endDate } = getBackfillDateRange();
    const prices = await fetchHistoricalPrices(symbol, startDate, endDate);

    if (prices.length === 0) {
      return { success: false, error: 'No price data returned from API' };
    }

    for (const entry of prices) {
      createPrice({
        commodityId,
        price: entry.price,
        date: entry.date,
      });
    }

    revalidatePath(`/commodities/${slug}`);
    revalidatePath('/commodities');
    return { success: true, count: prices.length };
  } catch (error) {
    console.error('Backfill action failed:', error);
    return { success: false, error: 'Failed to backfill historical prices' };
  }
}
