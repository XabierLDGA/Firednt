// Shared by server validation and Client Components: keep free of server-only imports.
import type { TagColor } from "@/lib/colors";
import type { TaskStatus } from "@/lib/db/enums";

export const TASK_TITLE_MAX = 200;
export const TASK_DESCRIPTION_MAX = 1000;

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: "Pendiente",
  DOING: "En curso",
  DONE: "Hecha",
};

export const TASK_STATUS_COLORS: Record<TaskStatus, TagColor> = {
  TODO: "sky",
  DOING: "yellow",
  DONE: "green",
};
