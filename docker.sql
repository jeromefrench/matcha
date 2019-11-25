-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: mysql:3306
-- Generation Time: Nov 25, 2019 at 11:54 AM
-- Server version: 5.7.28
-- PHP Version: 7.2.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `docker`
--
CREATE DATABASE IF NOT EXISTS `docker` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `docker`;

-- --------------------------------------------------------

--
-- Table structure for table `connection_log`
--

CREATE TABLE IF NOT EXISTS `connection_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `last_visit` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `connection_log`
--

INSERT INTO `connection_log` (`id`, `id_user`, `last_visit`) VALUES
(1, 3, '2019-11-25');

-- --------------------------------------------------------

--
-- Table structure for table `like_table`
--

CREATE TABLE IF NOT EXISTS `like_table` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `id_i_like` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `like_table`
--

INSERT INTO `like_table` (`id`, `id_user`, `id_i_like`) VALUES
(11, 4, 3),
(15, 3, 14);

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE IF NOT EXISTS `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_author` int(11) NOT NULL,
  `id_recever` int(11) NOT NULL,
  `message_content` text NOT NULL,
  `data_stamp` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `id_author`, `id_recever`, `message_content`, `data_stamp`) VALUES
(1, 3, 4, 'on chat', '2019-11-22'),
(2, 4, 3, 'avec bebe', '2019-11-22');

-- --------------------------------------------------------

--
-- Table structure for table `photo`
--

CREATE TABLE IF NOT EXISTS `photo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` text NOT NULL,
  `path_photo` text NOT NULL,
  `profile` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `photo`
--

INSERT INTO `photo` (`id`, `id_user`, `path_photo`, `profile`) VALUES
(13, '10', '/public/photo/bbchat/0', 1),
(14, '11', 'https://s3.amazonaws.com/uifaces/faces/twitter/dannol/128.jpg', 1),
(15, '12', 'https://s3.amazonaws.com/uifaces/faces/twitter/rickyyean/128.jpg', 1),
(16, '13', '/public/photo/bbchat/0', 1),
(17, '14', 'https://s3.amazonaws.com/uifaces/faces/twitter/matkins/128.jpg', 1),
(18, '4', '/public/photo/blabli/0', 1),
(20, '3', '/public/photo/jean/0', 1),
(23, '3', '/public/photo/jean/1', 0);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login` text NOT NULL,
  `passwd` text NOT NULL,
  `fname` text NOT NULL,
  `lname` text NOT NULL,
  `mail` text NOT NULL,
  `num` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `login`, `passwd`, `fname`, `lname`, `mail`, `num`) VALUES
(1, 'jean2', 'jean-passwd2', 'jeanname2', 'dupond2', 'jean@dupond2', 0),
(3, 'jean', 'jean-passwd', 'jeanname', 'dupond', 'jean@dupond', 0),
(4, 'blabli', 'blabli', 'bli', 'bla', 'bli@bla.fr', 4308),
(11, 'Daniella_Hermann', 'aR2ZpdxqCUiGrMb', 'Glover', 'Edwin', 'Stan.Bins@yahoo.com', NULL),
(12, 'Emma.Gulgowski', 'nLQ2_gKN_VhEVmu', 'Hudson', 'Grayson', 'Lessie39@yahoo.com', NULL),
(14, 'Milton30', '6NEKqsA6zaOiDRO', 'Ziemann', 'Brandy', 'Yolanda_Kihn69@gmail.com', NULL),
(15, 'bbchat', '&Bbchat28&', 'Lejeune', 'Laëtitia', 'laetitia-lejeune@live.fr', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_info`
--

CREATE TABLE IF NOT EXISTS `user_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `gender` enum('male','female','other','') DEFAULT NULL,
  `orientation` enum('men','women','everyone','') DEFAULT NULL,
  `bio` tinytext,
  `birthday` date DEFAULT NULL,
  `interests` set('voyage','cuisine','escalade','equitation','sieste','soleil') DEFAULT NULL,
  `country` text,
  `city` text,
  `zip_code` decimal(10,0) DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `latitude` float DEFAULT NULL,
  `completed` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_info`
--

INSERT INTO `user_info` (`id`, `id_user`, `gender`, `orientation`, `bio`, `birthday`, `interests`, `country`, `city`, `zip_code`, `longitude`, `latitude`, `completed`) VALUES
(5, 4, 'male', 'women', 'my bio', NULL, 'equitation', '', '', '0', 0, 0, 1),
(6, 10, 'female', 'men', '789451632', NULL, 'voyage,cuisine,escalade', '', '', '0', 0, 0, 1),
(7, 11, 'female', 'men', 'Voluptate velit aut aut blanditiis voluptatum.', NULL, 'voyage', '', '', '0', 0, 0, 1),
(8, 12, 'other', 'men', 'Sed doloribus voluptate velit maiores earum.', NULL, 'sieste', '', '', '0', 0, 0, 1),
(9, 13, 'male', 'women', '', NULL, NULL, '', '', '0', 0, 0, 0),
(10, 14, 'female', 'men', 'Labore neque eum voluptatibus ab laudantium.', NULL, 'escalade', '', '', '0', 0, 0, 1),
(11, 3, 'other', 'everyone', 'bio biologique', '2021-11-12', 'soleil', 'France', 'Paris', '75017', 2.29416, 48.879, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_sub`
--

CREATE TABLE IF NOT EXISTS `user_sub` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login` text NOT NULL,
  `passwd` text NOT NULL,
  `lname` text NOT NULL,
  `fname` text NOT NULL,
  `mail` text NOT NULL,
  `num` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `visited`
--

CREATE TABLE IF NOT EXISTS `visited` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `id_visited` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `visited`
--

INSERT INTO `visited` (`id`, `id_user`, `id_visited`) VALUES
(1, 42, 43),
(2, 3, 12),
(3, 4, 3),
(4, 3, 14),
(5, 3, 11);

-- --------------------------------------------------------

--
-- Table structure for table `vue_profile`
--

CREATE TABLE IF NOT EXISTS `vue_profile` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `vue` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `vue_profile`
--

INSERT INTO `vue_profile` (`id`, `id_user`, `vue`) VALUES
(1, 3, 15),
(2, 4, 36),
(3, 11, 12),
(4, 14, 10),
(5, 12, 3);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
