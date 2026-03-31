CREATE TABLE `purchases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`stripePaymentIntentId` varchar(255) NOT NULL,
	`stripeSessionId` varchar(255),
	`amountPence` int NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'gbp',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `purchases_id` PRIMARY KEY(`id`),
	CONSTRAINT `purchases_stripePaymentIntentId_unique` UNIQUE(`stripePaymentIntentId`)
);
