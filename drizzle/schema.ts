import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

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
  hasAccess: boolean("hasAccess").notNull().default(false),
  accessGrantedBy: mysqlEnum("accessGrantedBy", ["purchase", "admin", "owner"]),
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

// TAGB belt grades in order
export const BELT_GRADES = [
  "White Belt - 10th Kup",
  "White Belt  Yellow Tag - 9th Kup",
  "Yellow Belt - 8th Kup",
  "Yellow Belt Green Tag - 7th Kup",
  "Green Belt - 6th Kup",
  "Green Belt Blue Tag - 5th Kup",
  "Blue Belt - 4th Kup",
  "Blue Belt Red Tag - 3rd Kup",
  "Red Belt - 2nd Kup",
  "Red Belt Black Tag - 1st Kup",
  "Black Belt - 1st Dan",
  "Black Belt - 1st Dan 1st*",
  "Black Belt - 1st Dan 2nd*",
  "Black Belt - 2nd Dan",
  "Black Belt - 3rd Dan",
  "Black Belt - 4th Dan",
  "Black Belt - 5th Dan",
] as const;

export type BeltGrade = typeof BELT_GRADES[number];

// Club students — used for the 2026 Edition cards
export const students = mysqlTable("students", {
  id: int("id").autoincrement().primaryKey(),
  membershipNumber: varchar("membershipNumber", { length: 32 }).notNull().unique(),
  name: varchar("name", { length: 128 }).notNull(),
  grade: varchar("grade", { length: 128 }).notNull().default("White Belt - 10th Kup"),
  photoUrl: varchar("photoUrl", { length: 512 }),
  pendingPhotoUrl: varchar("pendingPhotoUrl", { length: 512 }),
  photoApproved: boolean("photoApproved").notNull().default(false),
  active: boolean("active").notNull().default(true),
  archivedAt: timestamp("archivedAt"),
  // Stats (auto-generated, can be overridden)
  power: int("power").notNull().default(50),
  speed: int("speed").notNull().default(50),
  technique: int("technique").notNull().default(50),
  flexibility: int("flexibility").notNull().default(50),
  aura: int("aura").notNull().default(50),
  specialMove: varchar("specialMove", { length: 128 }).notNull().default("Taekwondo Strike"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Student = typeof students.$inferSelect;
export type InsertStudent = typeof students.$inferInsert;