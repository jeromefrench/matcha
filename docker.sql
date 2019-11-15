-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Hôte : mysql:3306
-- Généré le :  ven. 15 nov. 2019 à 15:52
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `login`, `passwd`, `fname`, `lname`, `mail`, `num`) VALUES
(1, 'jean2', 'jean-passwd2', 'jeanname2', 'dupond2', 'jean@dupond2', 0),
(3, 'jean', 'jean-passwd', 'jeanname', 'dupond', 'jean@dupond', 0),
(4, 'blabli', 'blabli', 'bli', 'bla', 'bli@bla.fr', 4308),
(10, 'bbchat', 'bbchat', 'lejeune', 'laetitia', 'laetitia-lejeune@live.fr', 6265);

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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `user_info`
--

INSERT INTO `user_info` (`id`, `id_user`, `gender`, `orientation`, `bio`, `interests`) VALUES
(4, 3, 'female', NULL, '', NULL),
(5, 4, 'male', NULL, '', NULL);

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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
