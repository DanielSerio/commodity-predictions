import { getAllJobs } from '@/repositories/jobs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { JobsRefresher } from '../components/jobs-refresher';

export async function JobsPage() {
  const jobs = getAllJobs();
  const hasActiveJobs = jobs.some(
    (j) => j.statusSlug === 'pending' || j.statusSlug === 'running',
  );

  return (
    <div
      className="flex flex-col gap-6 p-6"
      data-testid="jobs-page"
    >
      <JobsRefresher hasActiveJobs={hasActiveJobs} />
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Background Jobs</h1>
        <p className="text-muted-foreground">
          Monitor the status and progress of system background tasks.
        </p>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[300px]">Progress</TableHead>
              <TableHead>Started</TableHead>
              <TableHead>Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No jobs found.
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow
                  key={job.id}
                  data-testid={`job-row-${job.id}`}
                >
                  <TableCell className="font-medium">{job.name}</TableCell>
                  <TableCell>
                    <JobStatusBadge
                      status={job.status}
                      slug={job.statusSlug}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Progress
                          value={job.progress}
                          className="h-2"
                        />
                        <span className="text-xs text-muted-foreground w-8 text-right font-mono">
                          {job.progress}%
                        </span>
                      </div>
                      {(job.totalItems ?? 0) > 0 && (
                        <div className="text-xs text-muted-foreground font-medium">
                          {job.processedItems} / {job.totalItems} items
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-[10px]">
                    {format(job.startedAt, 'MMM d, HH:mm:ss')}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {job.endedAt ? (
                      <span className="font-mono text-[10px]">
                        {formatDuration(job.startedAt, job.endedAt)}
                      </span>
                    ) : (
                      <span className="animate-pulse text-primary font-bold text-[10px] uppercase tracking-tighter">
                        Running...
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function JobStatusBadge({
  status,
  slug,
}: {
  status: string | null;
  slug: string | null;
}) {
  let variant: 'default' | 'secondary' | 'destructive' | 'outline' =
    'secondary';

  if (slug === 'completed') variant = 'default';
  else if (slug === 'failed') variant = 'destructive';
  else if (slug === 'running') variant = 'outline';

  return <Badge variant={variant}>{status ?? 'Unknown'}</Badge>;
}

function formatDuration(start: Date, end: Date) {
  const diff = end.getTime() - start.getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${seconds % 60}s`;
}
