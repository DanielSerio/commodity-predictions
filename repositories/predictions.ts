import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { predictions } from "@/lib/db/schema";

type NewPrediction = typeof predictions.$inferInsert;

export function getAllPredictions() {
  return db.select().from(predictions).all();
}

export function getPredictionById(id: number) {
  return db.select().from(predictions).where(eq(predictions.id, id)).get();
}

export function getPredictionsByCommodityId(commodityId: number) {
  return db
    .select()
    .from(predictions)
    .where(eq(predictions.commodityId, commodityId))
    .all();
}

export function getPredictionsByJobId(jobId: number) {
  return db
    .select()
    .from(predictions)
    .where(eq(predictions.jobId, jobId))
    .all();
}

export function createPrediction(data: NewPrediction) {
  return db.insert(predictions).values(data).returning().get();
}

export function updatePrediction(id: number, data: Partial<NewPrediction>) {
  return db
    .update(predictions)
    .set(data)
    .where(eq(predictions.id, id))
    .returning()
    .get();
}

export function removePrediction(id: number) {
  return db
    .delete(predictions)
    .where(eq(predictions.id, id))
    .returning()
    .get();
}
