import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import './globals.css';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

import { SiteHeader } from '@/components/layout/site-header';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Commodity Predictions',
  description: 'Human-in-the-loop commodity price forecasting',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} dark`}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans flex min-h-screen`}
      >
        {/* Abstract Background Blobs */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-emerald-500/10 rounded-full blur-[100px] animate-bounce [animation-duration:8s]" />
          <div className="absolute -bottom-[10%] left-[20%] w-[45%] h-[45%] bg-blue-600/10 rounded-full blur-[140px] animate-pulse [animation-duration:6s]" />
          <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[110px] animate-pulse [animation-duration:9s]" />
          <div className="absolute top-[40%] left-[30%] w-[25%] h-[25%] bg-rose-500/10 rounded-full blur-[90px] animate-pulse [animation-duration:7s]" />
          <div className="absolute -right-[5%] bottom-[10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[130px] animate-bounce [animation-duration:10s]" />
        </div>

        <TooltipProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="relative min-h-screen">
              <SiteHeader />
              <main className="flex-1 bg-transparent">{children}</main>
            </SidebarInset>
          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
