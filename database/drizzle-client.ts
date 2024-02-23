import { drizzle } from "drizzle-orm/libsql";
import { Client, createClient } from "@libsql/client";

declare global {
  var db: ReturnType<typeof drizzle> | undefined;
}

let db: ReturnType<typeof drizzle>;
let dbClient: Client | undefined;

if (process.env.NODE_ENV === "development") {
  if (!globalThis.db) {
    dbClient = createClient({
      url: process.env.TURSO_DB_URL as string,
      authToken: process.env.TURSO_DB_AUTH_TOKEN as string,
    });
    db = drizzle(dbClient);
    globalThis.db = db;
  }
  db = globalThis.db;
} else {
  dbClient = createClient({
    url: process.env.TURSO_DB_URL as string,
    authToken: process.env.TURSO_DB_AUTH_TOKEN as string,
  });
  db = drizzle(dbClient);
}

export default db;
