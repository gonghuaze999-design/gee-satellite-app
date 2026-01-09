CREATE TABLE `drawn_areas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`areaName` varchar(256) NOT NULL,
	`areaType` enum('polygon','rectangle','circle') NOT NULL,
	`geometry` json NOT NULL,
	`bounds` json,
	`description` text,
	`isFavorite` int DEFAULT 0,
	`usageCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `drawn_areas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `export_tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`taskId` varchar(128) NOT NULL,
	`imageId` varchar(256) NOT NULL,
	`taskName` varchar(256) NOT NULL,
	`status` enum('pending','running','completed','failed') NOT NULL DEFAULT 'pending',
	`format` enum('GeoTIFF','COG','JPEG','PNG') NOT NULL DEFAULT 'GeoTIFF',
	`progress` int DEFAULT 0,
	`downloadUrl` text,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`completedAt` timestamp,
	CONSTRAINT `export_tasks_id` PRIMARY KEY(`id`),
	CONSTRAINT `export_tasks_taskId_unique` UNIQUE(`taskId`)
);
--> statement-breakpoint
CREATE TABLE `search_filters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`filterName` varchar(256) NOT NULL,
	`cloudCoverMax` decimal(5,2) DEFAULT '30',
	`sensorType` varchar(64),
	`qualityMin` int DEFAULT 0,
	`ndviMin` decimal(4,3),
	`ndviMax` decimal(4,3),
	`description` text,
	`isDefault` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `search_filters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `time_series_analysis` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`analysisName` varchar(256) NOT NULL,
	`areaId` int,
	`geometry` json NOT NULL,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`timeStep` enum('daily','weekly','monthly','seasonal') NOT NULL DEFAULT 'monthly',
	`analysisType` enum('ndvi','ndwi','nbr','custom') NOT NULL DEFAULT 'ndvi',
	`imageCount` int DEFAULT 0,
	`resultUrl` text,
	`status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`completedAt` timestamp,
	CONSTRAINT `time_series_analysis_id` PRIMARY KEY(`id`)
);
