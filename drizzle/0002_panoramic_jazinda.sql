CREATE TABLE `scores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`playerName` varchar(64) NOT NULL,
	`edition` enum('blackbelt','2026') NOT NULL,
	`mode` enum('solo','multiplayer') NOT NULL DEFAULT 'solo',
	`wins` int NOT NULL DEFAULT 0,
	`losses` int NOT NULL DEFAULT 0,
	`draws` int NOT NULL DEFAULT 0,
	`totalCards` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scores_id` PRIMARY KEY(`id`)
);
