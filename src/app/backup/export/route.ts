import { connection } from "next/server";
import { exportBackup } from "@/lib/backup/backup";
import { getDb } from "@/lib/db";

// Downloads every table as a JSON file. Same trust model as the Server
// Actions: no login yet (ADR 0002).
export async function GET() {
  await connection(); // read the database at request time, never at build time
  const backup = await exportBackup(getDb());
  const day = backup.exportedAt.toISOString().slice(0, 10);

  return new Response(JSON.stringify(backup, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="firednt-backup-${day}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
