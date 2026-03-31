CREATE TABLE `students` (
	`id` int AUTO_INCREMENT NOT NULL,
	`membershipNumber` varchar(32) NOT NULL,
	`name` varchar(128) NOT NULL,
	`grade` varchar(128) NOT NULL DEFAULT 'White Belt - 10th Kup',
	`photoUrl` varchar(512),
	`active` boolean NOT NULL DEFAULT true,
	`power` int NOT NULL DEFAULT 50,
	`speed` int NOT NULL DEFAULT 50,
	`technique` int NOT NULL DEFAULT 50,
	`flexibility` int NOT NULL DEFAULT 50,
	`aura` int NOT NULL DEFAULT 50,
	`specialMove` varchar(128) NOT NULL DEFAULT 'Taekwondo Strike',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `students_id` PRIMARY KEY(`id`),
	CONSTRAINT `students_membershipNumber_unique` UNIQUE(`membershipNumber`)
);
