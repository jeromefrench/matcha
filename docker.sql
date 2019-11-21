-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Hôte : mysql:3306
-- Généré le :  jeu. 21 nov. 2019 à 11:39
-- Version du serveur :  5.7.28
-- Version de PHP :  7.2.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `docker`
--
CREATE DATABASE IF NOT EXISTS `docker` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `docker`;

-- --------------------------------------------------------

--
-- Structure de la table `like_table`
--

CREATE TABLE IF NOT EXISTS `like_table` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `id_i_like` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `like_table`
--

INSERT INTO `like_table` (`id`, `id_user`, `id_i_like`) VALUES
(1, 3, 1),
(2, 3, 3),
(3, 3, 4),
(4, 3, 5),
(5, 4, 3);

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

CREATE TABLE IF NOT EXISTS `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_author` int(11) NOT NULL,
  `id_recever` int(11) NOT NULL,
  `message_content` text NOT NULL,
  `data_stamp` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `photo`
--

CREATE TABLE IF NOT EXISTS `photo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` text NOT NULL,
  `path_photo` text NOT NULL,
  `profile` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `photo`
--

INSERT INTO `photo` (`id`, `id_user`, `path_photo`, `profile`) VALUES
(11, '3', '/public/photo/jean/0', 0),
(12, '3', '/public/photo/jean/1', 1),
(13, '10', '/public/photo/bbchat/0', 1),
(14, '11', 'https://s3.amazonaws.com/uifaces/faces/twitter/dannol/128.jpg', 1),
(15, '12', 'https://s3.amazonaws.com/uifaces/faces/twitter/rickyyean/128.jpg', 1),
(16, '13', '/public/photo/bbchat/0', 1),
(17, '14', 'https://s3.amazonaws.com/uifaces/faces/twitter/matkins/128.jpg', 1);

-- --------------------------------------------------------

--
-- Structure de la table `user`
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
-- Déchargement des données de la table `user`
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
-- Structure de la table `user_info`
--

CREATE TABLE IF NOT EXISTS `user_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `gender` enum('male','female','other','') DEFAULT NULL,
  `orientation` enum('men','women','everyone','') DEFAULT NULL,
  `bio` tinytext,
  `interests` set('voyage','cuisine','escalade','equitation','sieste','soleil') DEFAULT NULL,
  `completed` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `user_info`
--

INSERT INTO `user_info` (`id`, `id_user`, `gender`, `orientation`, `bio`, `interests`, `completed`) VALUES
(4, 3, 'female', NULL, '', NULL, 0),
(5, 4, 'male', NULL, '', NULL, 0),
(6, 10, 'female', 'men', '789451632', 'voyage,cuisine,escalade', 1),
(7, 11, 'female', 'men', 'Voluptate velit aut aut blanditiis voluptatum.', 'voyage', 1),
(8, 12, 'other', 'men', 'Sed doloribus voluptate velit maiores earum.', 'sieste', 1),
(9, 13, 'male', 'women', '', NULL, 0),
(10, 14, 'female', 'men', 'Labore neque eum voluptatibus ab laudantium.', 'escalade', 1);

-- --------------------------------------------------------

--
-- Structure de la table `user_sub`
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
-- Structure de la table `vue_profile`
--

CREATE TABLE IF NOT EXISTS `vue_profile` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `vue` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
