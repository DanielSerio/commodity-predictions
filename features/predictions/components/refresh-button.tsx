'use client';

import { RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';

export function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      className="gap-2 rounded-full px-6 hover:bg-primary/5"
      onClick={() => {
        startTransition(() => {
          router.refresh();
        });
      }}
      disabled={isPending}
      data-testid="refresh-predictions-button"
    >
      <RefreshCcw className={cn('h-4 w-4', isPending && 'animate-spin')} />
      {isPending ? 'Refreshing...' : 'Refresh Data'}
    </Button>
  );
}
