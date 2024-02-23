CREATE TABLE `chat` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`name` text,
	`ownerId` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `message` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`content` text NOT NULL,
	`role` text NOT NULL,
	`chatId` text NOT NULL,
	FOREIGN KEY (`chatId`) REFERENCES `chat`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP TABLE `account`;--> statement-breakpoint
DROP TABLE `session`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
DROP TABLE `verificationToken`;