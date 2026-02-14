import { ModelsPage } from '@/features/models/pages/models-page';

export const metadata = {
  title: 'Models',
  description: 'Ollama-powered models for commodity price forecasting.',
};

export default function Page() {
  return <ModelsPage />;
}
