import { notFound } from 'next/navigation';
import { PredictionDetailPage } from '@/features/predictions/pages/prediction-detail-page';

export const metadata = {
  title: 'Review Prediction',
  description: 'Validate and adjust AI commodity forecasts.',
};

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const predictionId = parseInt(id);

  if (isNaN(predictionId)) {
    notFound();
  }

  return <PredictionDetailPage predictionId={predictionId} />;
}
