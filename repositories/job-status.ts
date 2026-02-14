import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { jobStatus } from "@/lib/db/schema";

type NewJobStatus = typeof jobStatus.$inferInsert;

export function getAllJobStatuses() {
  return db.select().from(jobStatus).all();
}

export function getJobStatusById(id: number) {
  return db.select().from(jobStatus).where(eq(jobStatus.id, id)).get();
}

export function createJobStatus(data: NewJobStatus) {
  return db.insert(jobStatus).values(data).returning().get();
}

export function updateJobStatus(id: number, data: Partial<NewJobStatus>) {
  return db
    .update(jobStatus)
    .set(data)
    .where(eq(jobStatus.id, id))
    .returning()
    .get();
}

export function removeJobStatus(id: number) {
  return db.delete(jobStatus).where(eq(jobStatus.id, id)).returning().get();
}
