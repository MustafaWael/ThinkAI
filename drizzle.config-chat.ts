import { defineConfig } from "drizzle-kit";

if (!process.env.TURSO_CHAT_DB_URL) {
  throw new Error("TURSO_CHAT_DB_URL environment variable is required");
}

export default defineConfig({
  schema: "./database/drizzle-chat-schema.ts",
  driver: "turso",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.TURSO_CHAT_DB_URL,
    authToken: process.env.TURSO_CHAT_DB_AUTH_TOKEN,
  },
  verbose: true,
  strict: true,
});
