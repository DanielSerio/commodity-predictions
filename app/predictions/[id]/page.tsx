import { notFound } from 'next/navigation';
import { PredictionDetailPage } from '@/features/predictions/pages/prediction-detail-page';

export const metadata = {
  title: 'Review Prediction',
  description: 'Validate and adjust AI commodity forecasts.',
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const predictionId = parseInt(id);

  if (isNaN(predictionId)) {
    notFound();
  }

  return <PredictionDetailPage predictionId={predictionId} />;
}
