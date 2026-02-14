import { eq, desc, isNull, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { predictions, commodities, models } from "@/lib/db/schema";

type NewPrediction = typeof predictions.$inferInsert;

export function getAllPredictions() {
  return db.select().from(predictions).all();
}

export function getAllPredictionsExtended() {
  return db
    .select({
      id: predictions.id,
      commodityName: commodities.name,
      modelName: models.name,
      modelConfidence: predictions.modelConfidence,
      humanConfidence: predictions.humanConfidence,
      predictionDate: predictions.predictionDate,
      predictedPrice: predictions.predictedPrice,
      humanPredictedPrice: predictions.humanPredictedPrice,
      createdAt: predictions.createdAt,
    })
    .from(predictions)
    .leftJoin(commodities, eq(predictions.commodityId, commodities.id))
    .leftJoin(models, eq(predictions.modelId, models.id))
    .orderBy(desc(predictions.createdAt))
    .all();
}

export function getUnreviewedPredictionsCount() {
  return db
    .select({ count: count() })
    .from(predictions)
    .where(isNull(predictions.humanConfidence))
    .get();
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
