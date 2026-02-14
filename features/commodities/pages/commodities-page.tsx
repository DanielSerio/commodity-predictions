import { getAllCommodities } from '@/repositories/commodities';
import { CommodityList } from '../components/commodity-list';

export async function CommoditiesPage() {
  const commodities = await getAllCommodities();

  return (
    <div className="flex flex-col gap-8 p-8" data-testid="commodities-page">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Commodities</h1>
        <p className="text-muted-foreground text-lg italic">
          Tracked materials and their historical performance data.
        </p>
      </div>

      <div className="grid gap-6">
        <CommodityList data={commodities} />
      </div>
    </div>
  );
}
