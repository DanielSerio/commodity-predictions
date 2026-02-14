import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// ── Commodities ──────────────────────────────────────────────────────────────

export const commodities = sqliteTable("commodities", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  symbol: text("symbol").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const insertCommoditySchema = createInsertSchema(commodities);
export const selectCommoditySchema = createSelectSchema(commodities);

// ── Prices ───────────────────────────────────────────────────────────────────

export const prices = sqliteTable("prices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  commodityId: integer("commodity_id")
    .notNull()
    .references(() => commodities.id),
  price: real("price").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
});

export const insertPriceSchema = createInsertSchema(prices);
export const selectPriceSchema = createSelectSchema(prices);

// ── Models ───────────────────────────────────────────────────────────────────

export const models = sqliteTable("models", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(false),
});

export const insertModelSchema = createInsertSchema(models);
export const selectModelSchema = createSelectSchema(models);

// ── Job Status ───────────────────────────────────────────────────────────────

export const jobStatus = sqliteTable("job_status", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
});

export const insertJobStatusSchema = createInsertSchema(jobStatus);
export const selectJobStatusSchema = createSelectSchema(jobStatus);

// ── Jobs ─────────────────────────────────────────────────────────────────────

export const jobs = sqliteTable("jobs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  startedAt: integer("started_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  endedAt: integer("ended_at", { mode: "timestamp" }),
  statusId: integer("status_id")
    .notNull()
    .references(() => jobStatus.id),
  progress: integer("progress").notNull().default(0),
  totalItems: integer("total_items").default(0),
  processedItems: integer("processed_items").default(0),
});

export const insertJobSchema = createInsertSchema(jobs);
export const selectJobSchema = createSelectSchema(jobs);

// ── Predictions ──────────────────────────────────────────────────────────────

export const predictions = sqliteTable("predictions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  jobId: integer("job_id")
    .notNull()
    .references(() => jobs.id),
  commodityId: integer("commodity_id")
    .notNull()
    .references(() => commodities.id),
  modelId: integer("model_id")
    .notNull()
    .references(() => models.id),
  modelConfidence: real("model_confidence").notNull(), // 1-100
  humanConfidence: real("human_confidence"), // 1-100, null = unreviewed
  predictionDate: integer("prediction_date", { mode: "timestamp" }).notNull(),
  predictedPrice: real("predicted_price"),
  humanPredictedPrice: real("human_predicted_price"), // null = no override
  predictionActualDelta: real("prediction_actual_delta"), // null = actual not yet available
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const insertPredictionSchema = createInsertSchema(predictions);
export const selectPredictionSchema = createSelectSchema(predictions);
