import { InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const chats = sqliteTable("chat", {
  id: text("id").notNull().primaryKey(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull(),
  name: text("name"),
  ownerId: text("ownerId").notNull(),
});

export const messages = sqliteTable("message", {
  id: text("id").notNull().primaryKey(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull(),
  content: text("content").notNull(),
  role: text("role", {
    enum: ["system", "user", "assistant", "function", "data", "tool"],
  }).notNull(), // Consider an enum type if roles are predefined
  chatId: text("chatId")
    .notNull()
    .references(() => chats.id),
});

export type Chat = InferSelectModel<typeof chats>;
export type Message = InferSelectModel<typeof messages>;
