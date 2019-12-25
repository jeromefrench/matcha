let bdd = require('../models/account.js');

exports.get_user_i_like = async function (login){
	id_user = await bdd.get_id_user(login);
	var sql = "SELECT * FROM `docker`.`user` INNER JOIN `docker`.`user_info` ON `docker`.`user`.`id` = `docker`.`user_info`.`id_user` INNER JOIN `docker`.`photo` ON `docker`.`user`.`id` = `docker`.`photo`.`id_user` INNER JOIN `docker`.`like_table` ON `docker`.`user`.`id` = `docker`.`like_table`.`id_i_like` WHERE `docker`.`user_info`.`completed` = 1 AND `docker`.`photo`.`profile` = 1 AND `docker`.`like_table`.`id_user` = ?";
	var todo = [id_user];
	result = await db.query(sql, todo);
	return (result);
}

exports.get_user_they_like_me = async function (login){
	id_user = await bdd.get_id_user(login);
	var sql = "SELECT * FROM `docker`.`user` INNER JOIN `docker`.`user_info` ON `docker`.`user`.`id` = `docker`.`user_info`.`id_user` INNER JOIN `docker`.`photo` ON `docker`.`user`.`id` = `docker`.`photo`.`id_user` INNER JOIN `docker`.`like_table` ON `docker`.`user`.`id` = `docker`.`like_table`.`id_user` WHERE `docker`.`user_info`.`completed` = 1 AND `docker`.`photo`.`profile` = 1 AND `docker`.`like_table`.`id_i_like` = ?";
	var todo = [id_user];
	result = await db.query(sql, todo);
	return (result);
}

exports.get_user_my_match = async function (login){
	var i = 0;
	id_user = await bdd.get_id_user(login);
	var sql = "SELECT * FROM `like_table` INNER JOIN `user` ON `docker`.`user`.`id` = `docker`.`like_table`.`id_user` INNER JOIN `photo` ON `docker`.`photo`.`id_user` = `docker`.`like_table`.`id_user` WHERE `id_i_like` = ? AND `like_table`.`id_user` IN (SELECT `id_i_like` FROM `like_table` WHERE `id_user` = ?)";
	var todo = [id_user, id_user];
	result = await db.query(sql, todo);
	return (result);
}

exports.get_user_they_watched_me = async function (login){
	id_user = await bdd.get_id_user(login);
	var sql = "SELECT * FROM `docker`.`user` INNER JOIN `docker`.`user_info` ON `docker`.`user`.`id` = `docker`.`user_info`.`id_user` INNER JOIN `docker`.`photo` ON `docker`.`user`.`id` = `docker`.`photo`.`id_user` INNER JOIN `docker`.`visited` ON `docker`.`user`.`id` = `docker`.`visited`.`id_user` WHERE `docker`.`visited`.`id_visited` = ?";
	var todo = [id_user];
	result = await db.query(sql, todo);
	return (result);
}
