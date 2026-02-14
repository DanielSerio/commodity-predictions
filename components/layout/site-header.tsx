'use client';

import * as React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Target } from 'lucide-react';
import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="sticky top-2 z-50 mx-2 rounded-lg border border-white/10 bg-background/60 backdrop-blur-xl shadow-lg shadow-black/20" data-testid="site-header">
      <div className="flex h-14 items-center gap-4 px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2 font-bold tracking-tight">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-lg shadow-primary/20">
              <Target className="h-5 w-5" />
            </div>
            <span className="text-xl italic font-black uppercase">
              Commodity AI
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
