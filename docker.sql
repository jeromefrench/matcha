-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Hôte : mysql:3306
-- Généré le :  mar. 12 nov. 2019 à 20:05
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
-- Structure de la table `info_user`
--

CREATE TABLE IF NOT EXISTS `info_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `gender` enum('male','female','other','') NOT NULL,
  `orientation` enum('men','women','everyone','') NOT NULL,
  `bio` tinytext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `info_user`
--

INSERT INTO `info_user` (`id`, `id_user`, `gender`, `orientation`, `bio`) VALUES
(1, 2, 'female', 'everyone', 'mnkl,fdskfx'),
(2, 4, 'male', 'men', 'blabla');

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
  `etat` enum('attente','valide') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `login`, `passwd`, `fname`, `lname`, `mail`, `etat`) VALUES
(1, 'jean2', 'jean-passwd2', 'jeanname2', 'dupond2', 'jean@dupond2', 'valide'),
(3, 'jean', 'jean-passwd', 'jeanname', 'dupond', 'jean@dupond', 'valide'),
(4, 'blabli', 'blabli', 'bli', 'bla', 'bli@bla.fr', 'valide'),
(22, 'lalali', 'lala', 'lili', 'lala', 'lalali@lili.fr', 'valide');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
