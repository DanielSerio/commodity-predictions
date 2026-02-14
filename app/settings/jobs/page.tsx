import { JobsPage } from '@/features/settings/pages/jobs-page';

export const metadata = {
  title: 'Background Jobs',
  description: 'Monitor the status and progress of system background tasks.',
};

export default function Page() {
  return <JobsPage />;
}
