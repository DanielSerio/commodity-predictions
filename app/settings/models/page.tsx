import { ModelSettingsPage } from '@/features/settings/pages/model-settings-page';

export const metadata = {
  title: 'Model Settings',
  description: 'Configure Ollama model parameters and behavior.',
};

export default function Page() {
  return <ModelSettingsPage />;
}
