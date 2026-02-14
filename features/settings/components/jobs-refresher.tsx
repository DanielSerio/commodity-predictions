'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface JobsRefresherProps {
  hasActiveJobs: boolean;
}

export function JobsRefresher({ hasActiveJobs }: JobsRefresherProps) {
  const router = useRouter();

  useEffect(() => {
    // If there are active jobs, refresh frequently
    // If no active jobs, refresh occasionally to catch new ones
    const intervalTime = hasActiveJobs ? 2000 : 10000;

    const interval = setInterval(() => {
      router.refresh();
    }, intervalTime);

    return () => clearInterval(interval);
  }, [hasActiveJobs, router]);

  return null;
}
