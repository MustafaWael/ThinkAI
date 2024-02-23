import "dotenv/config";
import { migrate } from "drizzle-orm/libsql/migrator";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

console.log("Migrating tables...", process);

export const client = createClient({
  url: process.env.TURSO_CHAT_DB_URL as string,
  authToken: process.env.TURSO_CHAT_DB_AUTH_TOKEN as string,
});

console.log("🚀 ~ client:", client);

export const db = drizzle(client);

async function main() {
  try {
    await migrate(db, {
      migrationsFolder: "drizzle/migrations",
    });
    console.log("Tables migrated!");
    process.exit(0);
  } catch (error) {
    console.error("Error performing migration: ", error);
    process.exit(1);
  }
}

main();