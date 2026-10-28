import { createDb, type Db } from "./client.ts";

let db: Db | undefined;

// Created on first use so builds and tests never need DATABASE_URL.
// Next.js loads .env.local automatically.
export function getDb(): Db {
  if (!db) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local.");
    }
    db = createDb(url);
  }
  return db;
}
