import { sql, type SQL } from "drizzle-orm";
import {
  check,
  integer,
  sqliteTable,
  text,
  type AnySQLiteColumn,
} from "drizzle-orm/sqlite-core";

export const PROJECT_STATUSES = ["IDEA", "IN_PROGRESS", "PAUSED", "DONE"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const TASK_STATUSES = ["TODO", "DOING", "DONE"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

// SQLite has no enum type: the `enum` option only narrows the TypeScript type,
// so a CHECK constraint also enforces the allowed values in the database.
function oneOf(column: AnySQLiteColumn, values: readonly string[]): SQL {
  const list = values.map((value) => `'${value}'`).join(", ");
  return sql`${column} IN (${sql.raw(list)})`;
}

const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
};

export const projects = sqliteTable(
  "projects",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    description: text("description"),
    status: text("status", { enum: PROJECT_STATUSES }).notNull().default("IDEA"),
    ...timestamps,
  },
  (table) => [
    check("projects_name_not_blank", sql`length(trim(${table.name})) > 0`),
    check("projects_status_valid", oneOf(table.status, PROJECT_STATUSES)),
  ],
);

export const tasks = sqliteTable(
  "tasks",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    status: text("status", { enum: TASK_STATUSES }).notNull().default("TODO"),
    position: integer("position").notNull().default(0),
    ...timestamps,
  },
  (table) => [
    check("tasks_title_not_blank", sql`length(trim(${table.title})) > 0`),
    check("tasks_status_valid", oneOf(table.status, TASK_STATUSES)),
  ],
);

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
