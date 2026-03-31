import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Tracks completed purchases for app access
export const purchases = mysqlTable("purchases", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }).notNull().unique(),
  stripeSessionId: varchar("stripeSessionId", { length: 255 }),
  amountPence: int("amountPence").notNull(),
  currency: varchar("currency", { length: 10 }).notNull().default("gbp"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Purchase = typeof purchases.$inferSelect;
export type InsertPurchase = typeof purchases.$inferInsert;

// Leaderboard scores for both editions
export const scores = mysqlTable("scores", {
  id: int("id").autoincrement().primaryKey(),
  playerName: varchar("playerName", { length: 64 }).notNull(),
  edition: mysqlEnum("edition", ["blackbelt", "2026"]).notNull(),
  mode: mysqlEnum("mode", ["solo", "multiplayer"]).notNull().default("solo"),
  wins: int("wins").notNull().default(0),
  losses: int("losses").notNull().default(0),
  draws: int("draws").notNull().default(0),
  totalCards: int("totalCards").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Score = typeof scores.$inferSelect;
export type InsertScore = typeof scores.$inferInsert;