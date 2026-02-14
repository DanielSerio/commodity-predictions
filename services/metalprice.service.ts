import { z } from 'zod';
import { format, subDays } from 'date-fns';

// Free tier limit: timeframe queries capped at 5 days
const BACKFILL_DAYS = 4;

// Zod schema for the MetalPrice API timeframe response
const timeframeResponseSchema = z.object({
  success: z.literal(true),
  base: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  rates: z.record(
    z.string(), // date key, e.g. "2021-04-22"
    z.record(z.string(), z.number()), // currency rates
  ),
});

// Error response shape from the API
const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    statusCode: z.number(),
    message: z.string(),
  }),
});

/**
 * Fetches historical prices from the MetalPrice API for a given commodity symbol.
 * Returns prices sorted by date ascending.
 *
 * @param symbol - The commodity's currency code (e.g. "XAU" for Gold)
 * @param startDate - Start date in "YYYY-MM-DD" format
 * @param endDate - End date in "YYYY-MM-DD" format
 */
export async function fetchHistoricalPrices(
  symbol: string,
  startDate: string,
  endDate: string,
): Promise<{ date: Date; price: number }[]> {
  const apiKey = process.env.METALPRICE_API_KEY;
  if (!apiKey) {
    throw new Error('METALPRICE_API_KEY environment variable is not set');
  }

  const url = new URL('https://api.metalpriceapi.com/v1/timeframe');
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('start_date', startDate);
  url.searchParams.set('end_date', endDate);
  url.searchParams.set('base', 'USD');
  url.searchParams.set('currencies', symbol);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`MetalPrice API error: ${response.status} ${response.statusText}`);
  }

  const raw = await response.json();

  // Check for API-level errors (e.g. plan limits, invalid params)
  const errorResult = errorResponseSchema.safeParse(raw);
  if (errorResult.success) {
    throw new Error(`MetalPrice API: ${errorResult.data.error.message}`);
  }

  const data = timeframeResponseSchema.parse(raw);

  // The API returns prices under the key "USD{symbol}" (e.g. "USDXAU")
  const priceKey = `USD${symbol}`;

  const prices: { date: Date; price: number }[] = [];

  for (const [dateStr, rates] of Object.entries(data.rates)) {
    const price = rates[priceKey];
    if (price !== undefined) {
      prices.push({
        date: new Date(dateStr),
        price,
      });
    }
  }

  // Sort by date ascending
  prices.sort((a, b) => a.date.getTime() - b.date.getTime());

  return prices;
}

/**
 * Computes the default backfill date range (30 days back from today).
 */
export function getBackfillDateRange() {
  const endDate = new Date();
  const startDate = subDays(endDate, BACKFILL_DAYS);
  return {
    startDate: format(startDate, 'yyyy-MM-dd'),
    endDate: format(endDate, 'yyyy-MM-dd'),
  };
}
