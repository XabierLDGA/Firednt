CREATE TABLE `learning_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`topic_id` integer NOT NULL,
	`title` text NOT NULL,
	`url` text,
	`done` integer DEFAULT false NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`topic_id`) REFERENCES `learning_topics`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "learning_items_title_not_blank" CHECK(length(trim("learning_items"."title")) > 0)
);
--> statement-breakpoint
CREATE TABLE `learning_topics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT "learning_topics_name_not_blank" CHECK(length(trim("learning_topics"."name")) > 0)
);
