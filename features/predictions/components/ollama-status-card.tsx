import { TrendingUp, AlertCircle } from 'lucide-react';
import { JobTriggerButton } from './job-trigger-button';
import { cn } from '@/lib/utils';

interface OllamaStatusCardProps {
  modelCount: number;
  isOnline: boolean;
}

export function OllamaStatusCard({
  modelCount,
  isOnline,
}: OllamaStatusCardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl bg-gradient-to-br p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-center border',
        isOnline
          ? 'from-zinc-900 via-zinc-900 to-black border-zinc-800'
          : 'from-red-950 via-zinc-900 to-black border-red-900/50',
      )}
      data-testid="ollama-status-card"
    >
      <div className="relative z-10">
        <h2 className="text-4xl font-black mb-4 tracking-tighter italic uppercase bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
          Ollama Engine
        </h2>

        {isOnline ? (
          <p className="text-zinc-400 leading-relaxed mb-6 max-w-sm text-lg">
            Your local AI workforce is ready. We currently have{' '}
            <span className="text-white font-bold">{modelCount}</span>{' '}
            {modelCount === 1 ? 'model' : 'models'} registered for commodity
            price forecasting.
          </p>
        ) : (
          <div className="flex flex-col gap-2 mb-6">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle size={20} />
              <p className="font-bold">Connection Refused</p>
            </div>
            <p className="text-zinc-400 leading-relaxed max-w-sm">
              The Ollama service is not responding at the configured base URL.
              Please ensure the engine is running locally.
            </p>
          </div>
        )}

        <div className="flex items-center gap-3 mb-2">
          <div
            className={cn(
              'h-3 w-3 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]',
              isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500',
            )}
          />
          <span className="text-sm font-bold uppercase tracking-widest text-zinc-500">
            {isOnline ? 'System Operational' : 'Offline / Error'}
          </span>
        </div>

        <JobTriggerButton disabled={!isOnline} />
      </div>
      <TrendingUp
        className="absolute -right-12 -bottom-12 opacity-5 text-zinc-100 rotate-12"
        size={280}
      />
    </div>
  );
}
