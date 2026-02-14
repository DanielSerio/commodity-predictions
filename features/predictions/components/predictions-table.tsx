'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Prediction {
  id: number;
  commodityName: string | null;
  modelName: string | null;
  modelConfidence: number;
  humanConfidence: number | null;
  predictionDate: Date | number;
  predictedPrice: number | null;
  humanPredictedPrice: number | null;
}

const columns: ColumnDef<Prediction>[] = [
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
          : new Date(row.original.predictionDate);
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
        variant={row.original.modelConfidence > 80 ? 'default' : 'outline'}
        className={cn(
          row.original.modelConfidence > 80 &&
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
      >
        Review Details
      </Link>
    ),
  },
];

export function PredictionsTable({ data }: { data: Prediction[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/30">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="hover:bg-transparent border-b"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="h-12 py-3 px-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="hover:bg-muted/50 transition-colors group border-b last:border-0"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="py-4 px-4 align-middle"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-32 text-center text-muted-foreground italic"
              >
                No predictions available for review.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
