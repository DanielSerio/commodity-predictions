'use client';

import {
  LayoutDashboard,
  LineChart,
  Target,
  Settings2,
  TrendingUp,
  Cpu,
  Variable,
  Activity,
} from 'lucide-react';
import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { SidebarNavGroup } from './sidebar-nav-group';

const mainNavItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Predictions', url: '/predictions', icon: Target },
  { title: 'Commodities', url: '/commodities', icon: TrendingUp },
  { title: 'Models', url: '/models', icon: Cpu },
  { title: 'Analysis', url: '/analysis', icon: LineChart },
];

const settingsNavItems = [
  { title: 'Model Settings', url: '/settings/models', icon: Settings2 },
  { title: 'Calibration', url: '/settings/calibration', icon: Variable },
  { title: 'Background Jobs', url: '/settings/jobs', icon: Activity },
];

export function AppSidebar() {
  return (
    <Sidebar
      variant="floating"
      collapsible="icon"
    >
      <SidebarContent>
        <SidebarNavGroup
          label="Main Navigation"
          items={mainNavItems}
        />
        <SidebarNavGroup
          label="Configuration"
          items={settingsNavItems}
        />
      </SidebarContent>
    </Sidebar>
  );
}
