// Plain constants with no ORM imports, safe to use from Client Components.

export const PROJECT_STATUSES = ["IDEA", "IN_PROGRESS", "PAUSED", "DONE"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const TASK_STATUSES = ["TODO", "DOING", "DONE"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];
