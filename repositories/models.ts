import { eq, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { models } from "@/lib/db/schema";

type NewModel = typeof models.$inferInsert;

export function getAllModels() {
  return db.select().from(models).all();
}

export function getModelById(id: number) {
  return db.select().from(models).where(eq(models.id, id)).get();
}

export function createModel(data: NewModel) {
  return db.insert(models).values(data).returning().get();
}

export function updateModel(id: number, data: Partial<NewModel>) {
  return db.update(models).set(data).where(eq(models.id, id)).returning().get();
}

export function removeModel(id: number) {
  return db.delete(models).where(eq(models.id, id)).returning().get();
}

export function getActiveModel() {
  return db.select().from(models).where(eq(models.isActive, true)).get();
}

export function getModelCount() {
  return db.select({ count: count() }).from(models).get()?.count ?? 0;
}
