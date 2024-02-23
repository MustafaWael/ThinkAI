import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { messages, chats } from "@/database/drizzle-chat-schema";

const dbClient = createClient({
  url: process.env.TURSO_CHAT_DB_URL as string,
  authToken: process.env.TURSO_CHAT_DB_AUTH_TOKEN as string,
});

export const chatDB = drizzle(dbClient, { schema: { messages, chats } });
