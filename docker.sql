-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Hôte : mysql:3306
-- Généré le :  lun. 25 nov. 2019 à 18:35
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `connection_log`
--

INSERT INTO `connection_log` (`id`, `id_user`, `last_visit`) VALUES
(1, 3, '2019-11-25'),
(2, 15, '2019-11-25'),
(3, 76, '2019-11-25'),
(4, 77, '2019-11-25');

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

--
-- Déchargement des données de la table `like_table`
--

INSERT INTO `like_table` (`id`, `id_user`, `id_i_like`) VALUES
(11, 4, 3),
(15, 3, 14),
(18, 15, 15),
(20, 15, 77);

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
(1, 3, 4, 'on chat', '2019-11-22'),
(2, 4, 3, 'avec bebe', '2019-11-22'),
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
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `photo`
--

INSERT INTO `photo` (`id`, `id_user`, `path_photo`, `profile`) VALUES
(13, '10', '/public/photo/bbchat/0', 1),
(14, '11', 'https://s3.amazonaws.com/uifaces/faces/twitter/dannol/128.jpg', 1),
(15, '12', 'https://s3.amazonaws.com/uifaces/faces/twitter/rickyyean/128.jpg', 1),
(17, '14', 'https://s3.amazonaws.com/uifaces/faces/twitter/matkins/128.jpg', 1),
(18, '4', '/public/photo/blabli/0', 1),
(20, '3', '/public/photo/jean/1', 1),
(23, '3', '/public/photo/jean/1', 0),
(24, '15', '/public/photo/bbchat/0', 1),
(59, '74', 'https://s3.amazonaws.com/uifaces/faces/twitter/damenleeturks/128.jpg', 1),
(60, '75', 'https://s3.amazonaws.com/uifaces/faces/twitter/notbadart/128.jpg', 1),
(61, '76', 'https://s3.amazonaws.com/uifaces/faces/twitter/itskawsar/128.jpg', 1),
(62, '77', 'https://s3.amazonaws.com/uifaces/faces/twitter/kushsolitary/128.jpg', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=latin1;

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
(15, 'bbchat', '&Bbchat28&', 'Lejeune', 'Laëtitia', 'laetitia-lejeune@live.fr', NULL),
(74, 'matto.le-gall', 'gecasovili', 'Le gall', 'Mattéo', 'matto28@hotmail.fr', NULL),
(75, 'nathanroussel62', 'baragacewi', 'Roussel', 'Nathan', 'nathan.roussel09@yahoo.fr', NULL),
(76, 'alexis_poirier', 'qexavehaha', 'Poirier', 'Alexis', 'alexis.poirier86@hotmail.fr', NULL),
(77, 'lou_remy53', 'ciwugoqiso', 'Remy', 'Lou', 'lou.remy@gmail.com', NULL);

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
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `user_info`
--

INSERT INTO `user_info` (`id`, `id_user`, `gender`, `orientation`, `bio`, `birthday`, `interests`, `country`, `city`, `zip_code`, `longitude`, `latitude`, `completed`) VALUES
(5, 4, 'male', 'women', 'my bio', NULL, 'equitation', '', '', '0', 0, 0, 1),
(6, 10, 'female', 'men', '789451632', NULL, 'voyage,cuisine,escalade', '', '', '0', 0, 0, 1),
(7, 11, 'female', 'men', 'Voluptate velit aut aut blanditiis voluptatum.', NULL, 'voyage', '', '', '0', 0, 0, 1),
(8, 12, 'other', 'men', 'Sed doloribus voluptate velit maiores earum.', NULL, 'sieste', '', '', '0', 0, 0, 1),
(9, 13, 'male', 'women', '', NULL, NULL, '', '', '0', 0, 0, 0),
(10, 14, 'female', 'men', 'Labore neque eum voluptatibus ab laudantium.', NULL, 'escalade', '', '', '0', 0, 0, 1),
(11, 3, 'other', 'everyone', 'bio biologique', '2021-11-12', 'soleil', 'France', 'Paris', '75017', 2.29416, 48.879, 1),
(13, 15, 'female', 'everyone', 'oikjuhg', '1992-05-28', 'voyage,cuisine,escalade', 'France', 'Paris', '75017', 2.31789, 48.884, 1),
(46, 74, 'male', 'men', 'Doloribus dolorum et maxime voluptatem quibusdam.', '1965-08-04', 'soleil', 'RE', 'Le Tampon', '97422', -21.2831, 55.518, 1),
(47, 75, 'female', 'everyone', 'Sit est aspernatur eum.', '1966-01-18', 'sieste', 'FR', 'Tours', '37261', 47.3948, 0.70398, 1),
(48, 76, 'female', 'men', 'Ipsa in vitae impedit et vero possimus unde.', '1991-08-10', 'escalade', 'FR', 'Nanterre', '92050', 48.892, 2.20675, 1),
(49, 77, 'male', 'men', 'Laborum vel fugit accusantium consequatur et non et.', '1927-04-02', 'soleil', 'FR', 'Nantes', '44109', 47.2173, -1.55336, 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `visited`
--

INSERT INTO `visited` (`id`, `id_user`, `id_visited`) VALUES
(1, 42, 43),
(2, 3, 12),
(3, 4, 3),
(4, 3, 14),
(5, 3, 11),
(6, 15, 15),
(7, 15, 12),
(8, 15, 3),
(9, 15, 77);

-- --------------------------------------------------------

--
-- Structure de la table `vue_profile`
--

CREATE TABLE IF NOT EXISTS `vue_profile` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `vue` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `vue_profile`
--

INSERT INTO `vue_profile` (`id`, `id_user`, `vue`) VALUES
(1, 3, 24),
(2, 4, 36),
(3, 11, 15),
(4, 14, 10),
(5, 12, 6),
(6, 15, 40),
(7, 74, 2),
(8, 77, 4);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
