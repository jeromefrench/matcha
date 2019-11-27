-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Hôte : mysql:3306
-- Généré le :  mer. 27 nov. 2019 à 12:45
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
-- Structure de la table `block`
--

CREATE TABLE IF NOT EXISTS `block` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `id_block` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `connection_log`
--

CREATE TABLE IF NOT EXISTS `connection_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `last_visit` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `connection_log`
--

INSERT INTO `connection_log` (`id`, `id_user`, `last_visit`) VALUES
(1, 3, '2019-11-25'),
(2, 15, '2019-11-25'),
(11, 85, '2019-11-27'),
(12, 86, '2019-11-27'),
(13, 87, '2019-11-27'),
(14, 88, '2019-11-27');

-- --------------------------------------------------------

--
-- Structure de la table `like_table`
--

CREATE TABLE IF NOT EXISTS `like_table` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `id_i_like` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `messages`
--

INSERT INTO `messages` (`id`, `id_author`, `id_recever`, `message_content`, `data_stamp`) VALUES
(3, 15, 15, 'uiloh', '2019-11-25'),
(4, 15, 15, 'iugy', '2019-11-25');

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
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `photo`
--

INSERT INTO `photo` (`id`, `id_user`, `path_photo`, `profile`) VALUES
(20, '3', '/public/photo/jean/1', 1),
(24, '15', '/public/photo/bbchat/0', 1),
(70, '85', 'https://s3.amazonaws.com/uifaces/faces/twitter/sircalebgrove/128.jpg', 1),
(71, '86', 'https://s3.amazonaws.com/uifaces/faces/twitter/wiljanslofstra/128.jpg', 1),
(72, '87', 'https://s3.amazonaws.com/uifaces/faces/twitter/vm_f/128.jpg', 1),
(73, '88', 'https://s3.amazonaws.com/uifaces/faces/twitter/yesmeck/128.jpg', 1);

-- --------------------------------------------------------

--
-- Structure de la table `popularite`
--

CREATE TABLE IF NOT EXISTS `popularite` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `nb_like` int(11) NOT NULL DEFAULT '0',
  `nb_vue` int(11) NOT NULL DEFAULT '0',
  `pop` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `popularite`
--

INSERT INTO `popularite` (`id`, `id_user`, `nb_like`, `nb_vue`, `pop`) VALUES
(7, 85, 0, 418, 2),
(8, 86, 0, 942, 0),
(9, 87, 0, 774, 5),
(11, 2, 0, 45, 0),
(12, 3, 0, 25, 0),
(13, 88, 0, 964, 5),
(14, 15, 0, 51, 0);

-- --------------------------------------------------------

--
-- Structure de la table `report_fake`
--

CREATE TABLE IF NOT EXISTS `report_fake` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `id_faker` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

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
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `login`, `passwd`, `fname`, `lname`, `mail`, `num`) VALUES
(3, 'jean', 'jean-passwd', 'jeanname', 'dupond', 'jean@dupond', 0),
(15, 'bbchat', '&Bbchat28&', 'Lejeune', 'Laëtitia', 'laetitia-lejeune@live.fr', NULL),
(85, 'elisa_bourgeois', 'gahotahuwe', 'Bourgeois', 'Elisa', 'elisa.bourgeois29@yahoo.fr', NULL),
(86, 'enzo_dumont', 'zurulabudi', 'Dumont', 'Enzo', 'enzo.dumont@yahoo.fr', NULL),
(87, 'julie10', 'gokalabuho', 'Gauthier', 'Julie', 'julie.gauthier@gmail.com', NULL),
(88, 'nomie.marchal', 'sugutubume', 'Marchal', 'Noémie', 'nomiemarchal77@hotmail.fr', NULL);

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
  `birthday` date DEFAULT NULL,
  `interests` set('voyage','cuisine','escalade','equitation','sieste','soleil') DEFAULT NULL,
  `country` text,
  `city` text,
  `zip_code` decimal(10,0) DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `latitude` float DEFAULT NULL,
  `completed` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `user_info`
--

INSERT INTO `user_info` (`id`, `id_user`, `gender`, `orientation`, `bio`, `birthday`, `interests`, `country`, `city`, `zip_code`, `longitude`, `latitude`, `completed`) VALUES
(11, 3, 'other', 'everyone', 'bio biologique', '2021-11-12', 'soleil', 'France', 'Paris', '75017', 2.29416, 48.879, 1),
(13, 15, 'female', 'everyone', 'oikjuhg', '1992-05-28', 'voyage,cuisine,escalade', 'France', 'Paris', '75017', 2.31789, 48.884, 1),
(56, 85, 'female', 'everyone', 'Inventore incidunt aperiam neque nobis non doloribus quia.', '1927-07-07', 'cuisine', 'FR', 'Courbevoie', '92026', 2.25666, 48.8967, 1),
(57, 86, 'other', 'everyone', 'Est ullam dolore hic.', '1956-10-13', 'voyage', 'FR', 'Mérignac', '33281', -0.63381, 44.8325, 1),
(58, 87, 'other', 'women', 'Autem facilis blanditiis error adipisci repellat.', '1979-05-17', 'escalade', 'FR', 'Amiens', '80021', 2.3, 49.9, 1),
(59, 88, 'female', 'men', 'Itaque voluptate ea.', '1994-02-02', 'escalade', 'FR', 'Saint-Denis', '93066', 2.36667, 48.9333, 1);

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
-- Structure de la table `visited`
--

CREATE TABLE IF NOT EXISTS `visited` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `id_visited` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `visited`
--

INSERT INTO `visited` (`id`, `id_user`, `id_visited`) VALUES
(6, 15, 15),
(8, 15, 3),
(12, 15, 87),
(13, 15, 85),
(14, 15, 88),
(15, 15, 86);

-- --------------------------------------------------------

--
-- Structure de la table `vue_profile`
--

CREATE TABLE IF NOT EXISTS `vue_profile` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `vue` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `vue_profile`
--

INSERT INTO `vue_profile` (`id`, `id_user`, `vue`) VALUES
(1, 3, 25),
(6, 15, 51),
(12, 85, 419),
(13, 86, 943),
(14, 87, 777),
(15, 88, 967);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
