import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { jobs, jobStatus } from "@/lib/db/schema";

type NewJob = typeof jobs.$inferInsert;

export function getAllJobs() {
  return db
    .select({
      id: jobs.id,
      name: jobs.name,
      startedAt: jobs.startedAt,
      endedAt: jobs.endedAt,
      status: jobStatus.name,
      statusSlug: jobStatus.slug,
      progress: jobs.progress,
      totalItems: jobs.totalItems,
      processedItems: jobs.processedItems,
    })
    .from(jobs)
    .leftJoin(jobStatus, eq(jobs.statusId, jobStatus.id))
    .orderBy(desc(jobs.startedAt))
    .all();
}

export function getJobById(id: number) {
  return db.select().from(jobs).where(eq(jobs.id, id)).get();
}

export function createJob(data: NewJob) {
  return db.insert(jobs).values(data).returning().get();
}

export function updateJob(id: number, data: Partial<NewJob>) {
  return db.update(jobs).set(data).where(eq(jobs.id, id)).returning().get();
}

export function removeJob(id: number) {
  return db.delete(jobs).where(eq(jobs.id, id)).returning().get();
}
