import { TrendingUp } from 'lucide-react';
import { JobTriggerButton } from './job-trigger-button';

interface OllamaStatusCardProps {
  modelCount: number;
}

export function OllamaStatusCard({ modelCount }: OllamaStatusCardProps) {
  return (
    <div
      className="rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-black p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-center border border-zinc-800"
      data-testid="ollama-status-card"
    >
      <div className="relative z-10">
        <h2 className="text-4xl font-black mb-4 tracking-tighter italic uppercase bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
          Ollama Engine
        </h2>
        <p className="text-zinc-400 leading-relaxed mb-6 max-w-sm text-lg">
          Your local AI workforce is ready. We currently have{' '}
          <span className="text-white font-bold">{modelCount}</span>{' '}
          {modelCount === 1 ? 'model' : 'models'} registered for commodity price
          forecasting.
        </p>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse" />
          <span className="text-sm font-bold uppercase tracking-widest text-zinc-500">
            System Operational
          </span>
        </div>

        <JobTriggerButton />
      </div>
      <TrendingUp
        className="absolute -right-12 -bottom-12 opacity-5 text-zinc-100 rotate-12"
        size={280}
      />
    </div>
  );
}
