import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { prices } from "@/lib/db/schema";

type NewPrice = typeof prices.$inferInsert;

export function getAllPrices() {
  return db.select().from(prices).all();
}

export function getPriceById(id: number) {
  return db.select().from(prices).where(eq(prices.id, id)).get();
}

export function getPricesByCommodityId(commodityId: number) {
  return db
    .select()
    .from(prices)
    .where(eq(prices.commodityId, commodityId))
    .all();
}

export function createPrice(data: NewPrice) {
  return db.insert(prices).values(data).returning().get();
}

export function createPrices(data: NewPrice[]) {
  return db.insert(prices).values(data).returning().all();
}

export function updatePrice(id: number, data: Partial<NewPrice>) {
  return db
    .update(prices)
    .set(data)
    .where(eq(prices.id, id))
    .returning()
    .get();
}

export function removePrice(id: number) {
  return db.delete(prices).where(eq(prices.id, id)).returning().get();
}
