'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { getAllPredictionsExtended } from '@/repositories/predictions';

export type Prediction = Awaited<
  ReturnType<typeof getAllPredictionsExtended>
>[number];

export function usePredictionsColumns(): ColumnDef<Prediction>[] {
  return React.useMemo(
    () => [
      {
        accessorKey: 'commodityName',
        header: 'Commodity',
        cell: ({ row }) => (
          <span className="font-semibold text-foreground">
            {row.original.commodityName || 'Unknown'}
          </span>
        ),
      },
      {
        accessorKey: 'modelName',
        header: 'Model',
        cell: ({ row }) => (
          <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
            {row.original.modelName || 'Unknown'}
          </code>
        ),
      },
      {
        accessorKey: 'predictionDate',
        header: 'For Date',
        cell: ({ row }) => {
          const date =
            row.original.predictionDate instanceof Date
              ? row.original.predictionDate
              : new Date(row.original.predictionDate as number);
          return format(date, 'MMM dd, yyyy');
        },
      },
      {
        accessorKey: 'predictedPrice',
        header: 'AI Price',
        cell: ({ row }) => (
          <span className="font-mono text-emerald-500 font-bold">
            ${row.original.predictedPrice?.toFixed(2) || '---'}
          </span>
        ),
      },
      {
        accessorKey: 'modelConfidence',
        header: 'AI Conf.',
        cell: ({ row }) => (
          <Badge
            variant={row.original.modelConfidence! > 80 ? 'default' : 'outline'}
            className={cn(
              row.original.modelConfidence! > 80 &&
                'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
            )}
          >
            {row.original.modelConfidence}%
          </Badge>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        cell: ({ row }) =>
          row.original.humanConfidence !== null ? (
            <Badge
              variant="default"
              className="bg-blue-500/10 text-blue-500 border-blue-500/20"
            >
              Reviewed
            </Badge>
          ) : (
            <Badge variant="secondary">Unreviewed</Badge>
          ),
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <Link
            href={`/predictions/${row.original.id}`}
            className="text-primary hover:underline font-medium text-sm transition-colors"
            data-testid={`review-link-${row.original.id}`}
          >
            Review Details
          </Link>
        ),
      },
    ],
    [],
  );
}
