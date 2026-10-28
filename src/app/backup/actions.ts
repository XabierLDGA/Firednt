"use server";

// Same trust model as the other actions: no login yet (ADR 0002).
import { revalidatePath } from "next/cache";
import { restoreBackup, type BackupCounts } from "@/lib/backup/backup";
import { parseBackup } from "@/lib/backup/schema";
import { getDb } from "@/lib/db";

export type ImportState = { error?: string; imported?: BackupCounts };

export async function importBackupAction(
  _previous: ImportState,
  formData: FormData,
): Promise<ImportState> {
  if (formData.get("confirm") !== "yes") {
    return { error: "Marca la casilla para confirmar que quieres reemplazar tus datos." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Elige el archivo de copia de seguridad (.json)." };
  }

  const backup = parseBackup(await file.text());
  if (!backup.success) return { error: backup.error };

  const imported = await restoreBackup(getDb(), backup.data);
  // Every page shows restored data.
  revalidatePath("/", "layout");
  return { imported };
}
