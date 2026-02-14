import { CommodityDetailPage } from '@/features/commodities/pages/commodity-detail-page';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <CommodityDetailPage slug={slug} />;
}
