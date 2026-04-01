ALTER TABLE `students` ADD `pendingPhotoUrl` varchar(512);--> statement-breakpoint
ALTER TABLE `students` ADD `photoApproved` boolean DEFAULT false NOT NULL;