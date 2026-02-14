import { CalibrationPage } from '@/features/settings/pages/calibration-page';

export const metadata = {
  title: 'Calibration',
  description: 'Fine-tune prediction parameters and confidence thresholds.',
};

export default function Page() {
  return <CalibrationPage />;
}
