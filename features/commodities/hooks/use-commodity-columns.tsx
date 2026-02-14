'use client';

import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { TrendingUp, ArrowUpDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Commodity {
  id: number;
  name: string;
  slug: string;
  symbol: string;
  createdAt: Date;
}

// Column definition hooks are exempt from the 100-line limit per CLAUDE.md
export function useCommodityColumns(): ColumnDef<Commodity>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === 'asc')
            }
          >
            Commodity
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-2 font-medium">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full text-primary">
            <TrendingUp className="h-4 w-4" />
          </div>
          {row.getValue('name')}
        </div>
      ),
    },
    {
      accessorKey: 'symbol',
      header: 'Symbol',
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="font-mono"
        >
          {row.getValue('symbol')}
        </Badge>
      ),
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {row.getValue('slug')}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="group"
          >
            <Link href={`/commodities/${row.original.slug}`}>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        );
      },
    },
  ];
}
