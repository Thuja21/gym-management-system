create database gym_system;
use gym_system;

CREATE TABLE `users` (
	`id` bigint NOT NULL AUTO_INCREMENT,
	`user_name` varchar(255) NOT NULL,
	`full_name` varchar(250) NOT NULL,
	`password` varchar(255) NOT NULL,
	`email` varchar(250) NOT NULL,
	`contact_no` varchar(250) NOT NULL,
	`user_type` varchar(250) NOT NULL,
	`address` varchar(255) DEFAULT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ALTER TABLE `users`
-- ADD `address` varchar(255) DEFAULT NULL;

CREATE TABLE `trainers` (
  `trainer_id` bigint NOT NULL AUTO_INCREMENT,
  `specialization` varchar(255) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`trainer_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `trainer_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `plans` (
  `plan_id` bigint NOT NULL AUTO_INCREMENT,
  `plan_name` varchar(100) DEFAULT NULL,
  `plan_period_months` int DEFAULT NULL,
  `plan_price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`plan_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `schedules` (
  `schedule_id` bigint NOT NULL AUTO_INCREMENT,
  `schedule_details` varchar(255) DEFAULT NULL,
  `schedule_date` date DEFAULT NULL,
  `schedule_time_slot` time DEFAULT NULL,
  `trainer_id` bigint NOT NULL,
  PRIMARY KEY (`schedule_id`),
  KEY `trainer_id` (`trainer_id`),
  CONSTRAINT `schedule_ibfk_1` FOREIGN KEY (`trainer_id`) REFERENCES `trainers` (`trainer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `gym_members` (
	`member_id` bigint NOT NULL AUTO_INCREMENT,
	`user_id` bigint NOT NULL,
	`age` int DEFAULT NULL,
	`gender` varchar(10) DEFAULT NULL,
	`height` double DEFAULT NULL,
	`weight` double DEFAULT NULL,
	`blood_group` varchar(10) DEFAULT NULL,
	`current_fitness_level` varchar(50) DEFAULT NULL,
	`fitness_goal` varchar(50) DEFAULT NULL,
	`plan_id` bigint NOT NULL,
	`schedule_id` bigint DEFAULT NULL,
	`health_issues` varchar(250) DEFAULT NULL,
	PRIMARY KEY (`member_id`),
	KEY `user_id` (`user_id`),
	CONSTRAINT `gymmember_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
	CONSTRAINT `gymmember_ibfk_2` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`plan_id`),
	CONSTRAINT `gymmember_ibfk_3` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`schedule_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `customers` (
`customer_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`customer_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `customer_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO users (`user_name`,`full_name`,`password`, `email`,  `contact_no`, `user_type` , `address`) VALUES ('Thujithaaaa', 'Thujithaaaa P', '$2a$10$Vp9.qH2xh8P9U0M7Sav0uOVN9nYHDlL7H0hiDfoL7bInk4Syiksdq', 'thuujithaponnuthurai@gmail.com', '0776343553', 'CUSTOMER', 'Jaffna')


