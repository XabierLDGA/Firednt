import { drizzle } from "drizzle-orm/libsql";
// Explicit .ts extensions let Node run the seed script without a build step.
import * as schema from "./schema.ts";

export function createDb(url: string) {
  return drizzle({ connection: { url }, schema });
}

export type Db = ReturnType<typeof createDb>;
