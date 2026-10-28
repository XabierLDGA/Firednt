CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'IDEA' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT "projects_name_not_blank" CHECK(length(trim("projects"."name")) > 0),
	CONSTRAINT "projects_status_valid" CHECK("projects"."status" IN ('IDEA', 'IN_PROGRESS', 'PAUSED', 'DONE'))
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_id` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'TODO' NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "tasks_title_not_blank" CHECK(length(trim("tasks"."title")) > 0),
	CONSTRAINT "tasks_status_valid" CHECK("tasks"."status" IN ('TODO', 'DOING', 'DONE'))
);
