import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

// Single SQLite connection instance.
// better-sqlite3 is synchronous — no connection pool needed.
const sqlite = new Database("sqlite.db");

// WAL mode for better concurrent read performance
sqlite.pragma("journal_mode = WAL");

// Foreign key enforcement (off by default in SQLite)
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });
