'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { runPredictionJobAction } from '@/app/actions';

export function JobTriggerButton() {
  const [isPending, startTransition] = React.useTransition();

  const handleTrigger = () => {
    startTransition(async () => {
      toast.info('Initiating AI prediction job across all commodities...');
      const result = await runPredictionJobAction();

      if (result.success) {
        toast.success('Prediction job completed successfully!');
      } else {
        toast.error(
          'Failed to complete prediction job. Check Ollama connection.',
        );
      }
    });
  };

  return (
    <Button
      className="mt-6 font-bold tracking-tight rounded-xl py-6 px-8 transition-all hover:scale-105 active:scale-95 bg-white text-black hover:bg-zinc-200 disabled:opacity-50"
      onClick={handleTrigger}
      disabled={isPending}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Running Models...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-5 w-5 text-indigo-500" />
          Trigger Forecast Job
        </>
      )}
    </Button>
  );
}
