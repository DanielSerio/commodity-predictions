import { eq, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { commodities } from "@/lib/db/schema";

type NewCommodity = typeof commodities.$inferInsert;

export function getAllCommodities() {
  return db.select().from(commodities).all();
}

export function getCommodityById(id: number) {
  return db.select().from(commodities).where(eq(commodities.id, id)).get();
}

export function getCommodityBySlug(slug: string) {
  return db.select().from(commodities).where(eq(commodities.slug, slug)).get();
}

export function createCommodity(data: NewCommodity) {
  return db.insert(commodities).values(data).returning().get();
}

export function updateCommodity(id: number, data: Partial<NewCommodity>) {
  return db
    .update(commodities)
    .set(data)
    .where(eq(commodities.id, id))
    .returning()
    .get();
}

export function removeCommodity(id: number) {
  return db.delete(commodities).where(eq(commodities.id, id)).returning().get();
}

export function getCommodityCount() {
  return db.select({ count: count() }).from(commodities).get()?.count ?? 0;
}
