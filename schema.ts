import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  mobileNumber: text("mobile_number"),
  fullName: text("full_name"),
  balance: integer("balance").default(5000).notNull(),
  role: text("role").default("user").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  image: text("image"),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  playersCount: integer("players_count").default(0),
  rating: integer("rating").default(0)
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: integer("amount").notNull(),
  type: text("type").notNull(), // deposit, withdrawal, win, loss
  method: text("method"), // bKash, SSLCommerz, etc.
  status: text("status").default("pending"), // pending, completed, failed
  createdAt: timestamp("created_at").defaultNow()
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  mobileNumber: true,
  fullName: true,
});

export const insertGameSchema = createInsertSchema(games).pick({
  name: true,
  type: true,
  image: true,
  description: true,
  isActive: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  userId: true,
  amount: true,
  type: true,
  method: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
