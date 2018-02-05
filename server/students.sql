-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Feb 04, 2018 at 06:43 AM
-- Server version: 10.1.9-MariaDB
-- PHP Version: 5.6.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gdbaqsej_users`
--

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `studentID` int(50) NOT NULL,
  `firstname` varchar(400) CHARACTER SET utf16 DEFAULT NULL,
  `lastname` varchar(400) CHARACTER SET utf16 DEFAULT NULL,
  `email` varchar(400) CHARACTER SET utf16 DEFAULT NULL,
  `mobile` varchar(400) CHARACTER SET utf16 DEFAULT NULL,
  `username` varchar(40) CHARACTER SET utf16 DEFAULT NULL,
  `password` varchar(400) CHARACTER SET utf16 DEFAULT NULL,
  `token` varchar(400) CHARACTER SET utf16 DEFAULT NULL,
  `simulation` longtext CHARACTER SET utf16
) ENGINE=InnoDB DEFAULT CHARSET=utf16 COLLATE=utf16_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD UNIQUE KEY `studentID` (`studentID`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
