import { uuid, pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./user.model.js";

export const urlsTable = pgTable("urls", {
  id: uuid("id").primaryKey().defaultRandom(),

  code: varchar("code", { length: 155 }).notNull().unique(),

  url: text("target_url").notNull(),   // DB column = target_url, property name = url

  userId: uuid("user_id")
    .references(() => usersTable.id)
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});
