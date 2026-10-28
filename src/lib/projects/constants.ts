// Shared by server validation and Client Components: keep free of server-only imports.
import type { ProjectStatus } from "@/lib/db/enums";

export const PROJECT_NAME_MAX = 100;
export const PROJECT_DESCRIPTION_MAX = 500;

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  IDEA: "Idea",
  IN_PROGRESS: "En desarrollo",
  PAUSED: "Pausado",
  DONE: "Terminado",
};
