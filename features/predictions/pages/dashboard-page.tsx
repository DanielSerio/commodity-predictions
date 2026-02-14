import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, TrendingUp, Cpu, History as HistoryIcon } from 'lucide-react';
import Link from 'next/link';
import { getCommodityCount } from '@/repositories/commodities';
import { getModelCount } from '@/repositories/models';
import { RecentActivityCard } from '../components/recent-activity-card';
import { OllamaStatusCard } from '../components/ollama-status-card';

export async function DashboardPage() {
  const commodityCount = getCommodityCount();
  const modelCount = getModelCount();

  // Placeholder — no prediction review system exists yet
  const pendingReviews = 0;

  const stats = [
    {
      title: 'Tracked Commodities',
      value: String(commodityCount),
      icon: TrendingUp,
      description: 'Active price monitoring',
      href: '/commodities',
    },
    {
      title: 'Pending Reviews',
      value: String(pendingReviews),
      icon: Target,
      description: 'Predictions awaiting review',
      href: '/predictions',
    },
    {
      title: 'Active Models',
      value: String(modelCount),
      icon: Cpu,
      description: 'Ollama-powered engines',
      href: '/models',
    },
    {
      title: 'System Status',
      value: 'Online',
      icon: HistoryIcon,
      description: 'All services operational',
      href: '/analysis',
    },
  ];

  return (
    <div className="flex flex-col gap-8 p-8" data-testid="dashboard-page">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-lg italic">
          Welcome to the Commodity Prediction Engine.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:bg-primary/5 transition-all duration-300 cursor-pointer group hover:scale-[1.02]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivityCard />
        <OllamaStatusCard modelCount={modelCount} />
      </div>
    </div>
  );
}
