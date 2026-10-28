import { connection } from "next/server";
import { Dashboard } from "@/components/dashboard/dashboard";
import { getDashboardStats } from "@/lib/dashboard/stats";
import { getDb } from "@/lib/db";

// Reads the local database on every request, like the project pages.
export const instant = false;

export default async function Home() {
  await connection(); // read the database at request time, never at build time
  const stats = await getDashboardStats(getDb());
  return <Dashboard stats={stats} />;
}
