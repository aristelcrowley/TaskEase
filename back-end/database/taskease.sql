-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 16, 2025 at 12:43 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `taskease`
--

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--

CREATE TABLE `notes` (
  `note_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `note_name` varchar(40) DEFAULT NULL,
  `note_desc` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notes`
--

INSERT INTO `notes` (`note_id`, `user_id`, `note_name`, `note_desc`, `created_at`, `updated_at`) VALUES
(2, 17, 'Manga Goated', '1. Oyasumi punpun\n2. Oyasumi punpun\n3. Oyasumi punpun', '2025-05-15 20:06:59', '2025-05-15 20:09:17'),
(13, 17, 'adaaa', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n\n\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '2025-05-15 21:23:06', '2025-05-16 00:31:37');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `project_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `project_name` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`project_id`, `user_id`, `project_name`, `created_at`, `updated_at`) VALUES
(8, 18, 'TBO', '2025-05-15 00:00:05', '2025-05-15 00:00:05'),
(15, 17, 'PPLBO', '2025-05-15 14:06:32', '2025-05-15 14:06:32'),
(19, 17, 'Data Warehouse', '2025-05-15 19:26:54', '2025-05-15 19:26:54'),
(22, 17, 'GDG', '2025-05-15 23:03:01', '2025-05-15 23:03:01');

-- --------------------------------------------------------

--
-- Table structure for table `subtasks`
--

CREATE TABLE `subtasks` (
  `id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `title` varchar(50) DEFAULT NULL,
  `status` varchar(9) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subtasks`
--

INSERT INTO `subtasks` (`id`, `task_id`, `title`, `status`, `created_at`, `updated_at`) VALUES
(30, 37, 'Login', 'Completed', '2025-05-15 14:37:15', '2025-05-16 04:09:26'),
(35, 40, 'ada', 'Pending', '2025-05-15 18:57:02', '2025-05-15 18:57:04'),
(36, 40, 'asdada', 'Pending', '2025-05-15 18:57:02', '2025-05-15 18:57:04'),
(37, 40, 'adada', 'Pending', '2025-05-15 18:57:02', '2025-05-15 18:57:04'),
(38, 44, 'dim_time', 'Completed', '2025-05-15 19:27:42', '2025-05-15 19:27:55'),
(39, 44, 'dim_user', 'Pending', '2025-05-15 19:27:55', '2025-05-15 19:27:55'),
(41, 50, 'create routes', 'Completed', '2025-05-15 23:05:20', '2025-05-15 23:05:25'),
(42, 50, 'create database configuration', 'Completed', '2025-05-15 23:05:20', '2025-05-15 23:05:25'),
(43, 50, 'create models', 'Pending', '2025-05-15 23:05:20', '2025-05-15 23:05:25'),
(44, 50, 'create controllers', 'Pending', '2025-05-15 23:05:20', '2025-05-15 23:05:25');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `task_id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `task_name` varchar(40) DEFAULT NULL,
  `status` varchar(9) DEFAULT NULL,
  `deadline` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`task_id`, `project_id`, `task_name`, `status`, `deadline`, `created_at`, `updated_at`) VALUES
(13, 8, 'CFG', 'Pending', '2025-05-24 13:11:11', '2025-05-15 13:11:00', '2025-05-15 13:11:13'),
(22, 15, 'Use Case Diagram', 'Completed', '2025-05-31 07:00:00', '2025-05-15 14:13:28', '2025-05-16 04:09:31'),
(37, 15, 'Sequence Diagram', 'Pending', '2025-05-30 07:00:00', '2025-05-15 14:36:57', '2025-05-16 02:38:27'),
(39, 15, 'SRS', 'Completed', '2025-05-05 07:00:00', '2025-05-15 18:52:26', '2025-02-07 19:02:31'),
(40, 15, 'Class Diagram', 'Completed', '2025-05-17 07:00:00', '2025-05-15 18:57:02', '2025-05-15 19:02:42'),
(41, 15, 'Activity Diagram', 'Completed', '2025-05-15 19:04:08', '2025-05-01 19:03:00', '2025-04-26 19:03:49'),
(43, 15, 'Scenario', 'Completed', '2025-05-10 07:00:00', '2025-05-15 19:13:06', '2025-05-15 19:15:28'),
(44, 19, 'Buat Dimensi Table', 'Pending', '2025-06-19 07:00:00', '2025-05-15 19:27:42', '2025-05-15 19:27:55'),
(45, 19, 'Buat Fact Table', 'Pending', '2025-07-11 07:00:00', '2025-05-15 19:28:10', '2025-05-15 19:28:10'),
(46, 19, 'Buat Star Schema', 'Completed', '2025-02-13 07:00:00', '2025-05-15 19:28:41', '2025-05-15 19:28:43'),
(49, 22, 'book-management-api', 'Completed', '2025-05-31 07:00:00', '2025-05-15 23:03:17', '2025-05-15 23:03:20'),
(50, 22, 'secondhand-marketplace-api', 'Pending', '2025-09-18 07:00:00', '2025-05-15 23:05:20', '2025-05-15 23:05:25'),
(54, 22, 'submission-form', 'Completed', '2025-05-02 07:00:00', '2025-05-16 02:38:50', '2025-05-16 02:38:53'),
(55, 19, 'Buat data mentahan', 'Completed', '2025-05-17 07:00:00', '2025-05-16 03:16:43', '2025-05-16 03:16:46');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(256) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `created_at`, `updated_at`) VALUES
(17, 'aristel', '$2a$10$WvKdEe78xkNvZDkp9gciD.5g9hWeyg.Eqem5xensI5pQEv6JtEORS', '2025-05-14 15:25:22', '2025-05-14 15:25:22'),
(18, 'mezen', '$2a$10$E6k0JP6997j.0gZtstMoSu27FpDw6YxnjdSPKEjKGhi6y03WkJmIO', '2025-05-14 22:01:03', '2025-05-14 22:01:29'),
(19, 'test', '$2a$10$6KG8u.GcsiuMy0eH3cBCfugcUAQRehOkC8Zy2ZrzT4mbYadL.EZMy', '2025-05-16 01:15:18', '2025-05-16 01:15:18');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`note_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`project_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `subtasks`
--
ALTER TABLE `subtasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_id` (`task_id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`task_id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `notes`
--
ALTER TABLE `notes`
  MODIFY `note_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `project_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `subtasks`
--
ALTER TABLE `subtasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `task_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `notes`
--
ALTER TABLE `notes`
  ADD CONSTRAINT `notes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `subtasks`
--
ALTER TABLE `subtasks`
  ADD CONSTRAINT `subtasks_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`task_id`) ON DELETE CASCADE;

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
