import { uuid, pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";

import { usersTable } from './user.model.js';


export const userSessions = pgTable('user_session', {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => usersTable.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});