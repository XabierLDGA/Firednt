import { z } from "zod";
import { PROJECT_STATUSES, TASK_STATUSES } from "@/lib/db/enums";

// Bump when the file format changes in a way older files cannot be read as.
export const BACKUP_VERSION = 1;

const id = z.number().int().positive();
const position = z.number().int().nonnegative();
const notBlank = z.string().refine((value) => value.trim().length > 0, "No puede estar vacío.");
const date = z.iso.datetime({ offset: true }).transform((value) => new Date(value));
const timestamps = { createdAt: date, updatedAt: date };

// Rows are restored exactly as exported, ids included, so relations keep
// pointing at the same records.
const backupSchema = z
  .object({
    app: z.literal("firednt", { error: "No es una copia de seguridad de firedn't." }),
    version: z.literal(BACKUP_VERSION, {
      error: `Versión de copia no compatible (se esperaba ${BACKUP_VERSION}).`,
    }),
    exportedAt: date,
    projects: z.array(
      z.object({
        id,
        name: notBlank,
        description: z.string().nullable(),
        status: z.enum(PROJECT_STATUSES),
        ...timestamps,
      }),
    ),
    tasks: z.array(
      z.object({
        id,
        projectId: id,
        title: notBlank,
        description: z.string().nullable(),
        status: z.enum(TASK_STATUSES),
        position,
        ...timestamps,
      }),
    ),
    learningTopics: z.array(
      z.object({
        id,
        name: notBlank,
        description: z.string().nullable(),
        ...timestamps,
      }),
    ),
    learningItems: z.array(
      z.object({
        id,
        topicId: id,
        title: notBlank,
        // Same rule as the item form: links are rendered as <a href>.
        url: z.url({ protocol: /^https?$/ }).nullable(),
        done: z.boolean(),
        position,
        ...timestamps,
      }),
    ),
  })
  .superRefine((backup, ctx) => {
    for (const table of ["projects", "tasks", "learningTopics", "learningItems"] as const) {
      const seen = new Set<number>();
      backup[table].forEach((row, index) => {
        if (seen.has(row.id)) {
          ctx.addIssue({ code: "custom", path: [table, index, "id"], message: "Id repetido." });
        }
        seen.add(row.id);
      });
    }

    const projectIds = new Set(backup.projects.map((project) => project.id));
    backup.tasks.forEach((task, index) => {
      if (!projectIds.has(task.projectId)) {
        ctx.addIssue({
          code: "custom",
          path: ["tasks", index, "projectId"],
          message: "El proyecto no existe en la copia.",
        });
      }
    });

    const topicIds = new Set(backup.learningTopics.map((topic) => topic.id));
    backup.learningItems.forEach((item, index) => {
      if (!topicIds.has(item.topicId)) {
        ctx.addIssue({
          code: "custom",
          path: ["learningItems", index, "topicId"],
          message: "El tema no existe en la copia.",
        });
      }
    });
  });

// Dates are Date objects here; JSON.stringify writes them as ISO strings.
export type Backup = z.infer<typeof backupSchema>;

export type ParseBackupResult = { success: true; data: Backup } | { success: false; error: string };

const MAX_LISTED_ISSUES = 5;

// Parses the text of an uploaded file. The error explains what is wrong
// (in Spanish), listing the first few problems with where they are.
export function parseBackup(text: string): ParseBackupResult {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return { success: false, error: "El archivo no es un JSON válido." };
  }

  const result = backupSchema.safeParse(json, { error: z.locales.es().localeError });
  if (result.success) return { success: true, data: result.data };

  const issues = result.error.issues;
  const lines = issues
    .slice(0, MAX_LISTED_ISSUES)
    .map((issue) =>
      issue.path.length > 0 ? `${formatPath(issue.path)}: ${issue.message}` : issue.message,
    );
  if (issues.length > MAX_LISTED_ISSUES) {
    lines.push(`… y ${issues.length - MAX_LISTED_ISSUES} problemas más.`);
  }
  return { success: false, error: `El archivo no es una copia válida.\n${lines.join("\n")}` };
}

// ["tasks", 2, "status"] -> "tasks[2].status"
function formatPath(path: readonly PropertyKey[]): string {
  return path
    .map((key, index) =>
      typeof key === "number" ? `[${key}]` : `${index > 0 ? "." : ""}${String(key)}`,
    )
    .join("");
}
