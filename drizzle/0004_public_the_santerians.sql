ALTER TABLE `users` ADD `hasAccess` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `accessGrantedBy` enum('purchase','admin','owner');