let bdd = require('../models/bdd_functions.js');

exports.get_photo = function (login){
	bdd.get_id_user(login, (id_login) => {
		var sql = "SELECT * FROM `photos` WHERE `id_user` = ?";
		var todo = [id_login];
		conn.connection.query(sql, todo, (error, result) => {
			if (error) throw error;
			callback(result);
		});
	});
}

exports.insert_info_user = function (id_user, gender, orientation, bio, interests){
	var sql = "	INSERT INTO `info_user` (`id_user`, `gender`, `orientation`, `bio`, `interests`) VALUES (?, ?, ?, ?, ?, ?);";
	var todo = [id_user, gender, orientation, bio, interests];
	conn.connection.query(sql, todo, (error, result) => {
		if (error) throw error;
		callback(result);
	});
}

exports.update_info_user = function (id_user, gender, orientation, bio, interests){
	var sql = "UPDATE `info_user` SET `gender` = ?, `orientation` = ?, `bio` = ?, `interests` = ?  WHERE `id_user` = ?";
	var todo = [gender, orientation, bio, interests, id_user];
	conn.connection.query(sql, todo, (error, result) => {
		if (error) throw error;
		callback(result);
	});
}

exports.is_info_user_exist = function (login){
	bdd.get_id_user( (id_user) => {
		var sql = "SELECT * FROM `user_info` WHERE `id_user` = ?";
		var todo = [id_user];
		conn.connection.query(sql, todo, (error, result) => {
			if (error) throw error;
			if (result[0] == undefined) {
				callback(false);
			}
			else {
				callback(true);
			}
		});
	})
}
