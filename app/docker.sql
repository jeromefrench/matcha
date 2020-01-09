
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";



CREATE DATABASE IF NOT EXISTS `docker` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `docker`;


CREATE TABLE IF NOT EXISTS `block` ( `id` int(11) NOT NULL AUTO_INCREMENT, `id_user` int(11) NOT NULL, `id_block` int(11) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `connection_log` ( `id` int(11) NOT NULL AUTO_INCREMENT, `id_user` int(11) NOT NULL, `last_visit` date NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `like_table` ( `id` int(11) NOT NULL AUTO_INCREMENT, `id_user` int(11) NOT NULL, `id_i_like` int(11) NOT NULL, `match` int(11) DEFAULT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `messages` ( `id` int(11) NOT NULL AUTO_INCREMENT, `id_author` int(11) NOT NULL, `id_recever` int(11) NOT NULL, `message_content` text NOT NULL, `data_stamp` date NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `notifications` ( `id` int(11) NOT NULL AUTO_INCREMENT, `id_user` int(11) DEFAULT NULL, `id_user_i_send` int(11) NOT NULL, `messages` text, `lu` tinyint(1) NOT NULL DEFAULT '0', PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `photo` ( `id` int(11) NOT NULL AUTO_INCREMENT, `id_user` text NOT NULL, `path_photo` text NOT NULL, `profile` tinyint(1) NOT NULL DEFAULT '0', PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `popularite` ( `id` int(11) NOT NULL AUTO_INCREMENT, `id_user` int(11) NOT NULL, `nb_like` int(11) NOT NULL DEFAULT '0', `nb_vue` int(11) NOT NULL DEFAULT '0', `pop` int(11) NOT NULL DEFAULT '0', PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `report_fake` ( `id` int(11) NOT NULL AUTO_INCREMENT, `id_user` int(11) NOT NULL, `id_faker` int(11) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `user` ( `id` int(11) NOT NULL AUTO_INCREMENT, `login` text NOT NULL, `passwd` text NOT NULL, `fname` text NOT NULL, `lname` text NOT NULL, `mail` text NOT NULL, `num` int(11) DEFAULT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `user_info` ( `id` int(11) NOT NULL AUTO_INCREMENT, `id_user` int(11) NOT NULL, `gender` enum('male','female','other','') DEFAULT NULL, `orientation` enum('men','women','everyone','') DEFAULT NULL, `bio` tinytext, `birthday` date DEFAULT NULL, `interests` set('voyage','cuisine','escalade','equitation','sieste','soleil') DEFAULT NULL, `country` text, `city` text, `zip_code` text, `longitude` float DEFAULT NULL, `latitude` float DEFAULT NULL, `completed` tinyint(1) DEFAULT '0', PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `user_sub` ( `id` int(11) NOT NULL AUTO_INCREMENT, `login` text NOT NULL, `passwd` text NOT NULL, `lname` text NOT NULL, `fname` text NOT NULL, `mail` text NOT NULL, `num` int(11) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `visited` ( `id` int(11) NOT NULL AUTO_INCREMENT, `id_user` int(11) NOT NULL, `id_visited` int(11) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `vue_profile` ( `id` int(11) NOT NULL AUTO_INCREMENT, `id_user` int(11) NOT NULL, `vue` int(11) NOT NULL DEFAULT '0', PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;

COMMIT;
