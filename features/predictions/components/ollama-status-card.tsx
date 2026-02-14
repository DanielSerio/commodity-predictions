import { TrendingUp } from 'lucide-react';

interface OllamaStatusCardProps {
  modelCount: number;
}

export function OllamaStatusCard({ modelCount }: OllamaStatusCardProps) {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-center" data-testid="ollama-status-card">
      <div className="relative z-10">
        <h2 className="text-3xl font-black mb-4 tracking-tighter italic uppercase">
          Ollama Engine
        </h2>
        <p className="text-zinc-400 leading-relaxed mb-6 max-w-sm">
          Your local AI workforce is ready. We currently have{' '}
          {modelCount} {modelCount === 1 ? 'model' : 'models'} registered for
          commodity price forecasting.
        </p>
        <div className="flex gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            Llama 3.2 Connected
          </span>
        </div>
      </div>
      <TrendingUp
        className="absolute -right-12 -bottom-12 opacity-5 text-zinc-100"
        size={240}
      />
    </div>
  );
}
