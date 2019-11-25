let bdd = require('../models/bdd_functions.js');
var conn = require('./connection_bdd.js');

exports.get_photo = function (login, callback){
	bdd.get_id_user(login, (id_login) => {
		var sql = "SELECT * FROM `photos` WHERE `id_user` = ?";
		var todo = [id_login];
		conn.connection.query(sql, todo, (error, result) => {
			if (error) throw error;
			callback(result);
		});
	});
}

exports.get_info_user = function (login, callback){
	bdd.get_id_user(login, (id_login) => {
		var sql = "SELECT *, DATE_FORMAT(`birthday`, '%Y\\%m\\%d') as birth FROM `user_info` WHERE `id_user` = ?";
		var todo = [id_login];
		conn.connection.query(sql, todo, (error, result) => {
			if (error) throw error;
			callback(result);
		});
	});
}

function get_info_user(login, callback){
	bdd.get_id_user(login, (id_login) => {
		var sql = "SELECT *, DATE_FORMAT(`birthday`, '%Y\\%m\\%d') as birth FROM `user_info` WHERE `id_user` = ?";
		var todo = [id_login];
		conn.connection.query(sql, todo, (error, result) => {
			if (error) throw error;
			callback(result);
		});
	});
}

exports.insert_info_user_localalisation = function (login, country, city, zip_code, longitude, latitude, callback){
	get_info_user(login, (user) => {
		bdd.get_id_user(login, (id_user) => {
			if (user[0] == undefined){
				var sql = "INSERT INTO `user_info` (`id_user`, `country`, `city`, `zip_code`, `longitude`, `latitude`) VALUES (?, ?, ?, ?, ?, ?)";
				var todo = [id_user, country, city, zip_code, longitude, latitude];
				conn.connection.query(sql, todo, (error, result) => {
					if (error) throw error;
					callback();
				});
			}
			else{
				var sql = "UPDATE `user_info` SET `country` = ?, `city` = ?, `zip_code` = ?, `longitude` = ?, `latitude` = ? WHERE `id_user` = ?";
				var todo = [country, city, zip_code, longitude, latitude, id_user];
				conn.connection.query(sql, todo, (error, result) => {
					if (error) throw error;
					callback();
				});
			}
		});
	});
	// var sql = "UPDATE `user_info` SET `country` = ?, `city` = ?, `zip_code` = ?, `longitude` = ?, `latitude` = ? WHERE `id_user` = ?";
	// var todo = [country, city, zip_code, longitude, latitude, id_user];
	// conn.connection.query(sql, todo, (error, result) => {
	// 	if (error) throw error;
	// 	callback();
	// })
}

exports.insert_info_user = function (id_user, gender, orientation, bio, interests, birthday){
	var sql = "INSERT INTO `user_info` (`id_user`, `gender`, `orientation`, `bio`, `interests`, `birthday`) VALUES (?, ?, ?, ?, ?, ?);";
	inter = "";
	itemsProcessed = 0;
	if (interests !=undefined && interests != null && Array.isArray(interests)){
		interests.forEach(function(interest) {
			if (inter == ""){
				inter += interest;
			}else{
				inter += "," + interest;
			}
			itemsProcessed++;
			if(itemsProcessed === interests.length) {
				var todo = [id_user, gender, orientation, bio, inter, birthday];
				conn.connection.query(sql, todo, (error, result) => {
					if (error) throw error;
					isCompleted(id_user, gender, orientation, bio, interests);
				})
			}
		});
	}
	else {
		inter = interests;
		if (birthday == 'undefined--undefined') {birthday = null;}
		console.log("JFIWGVARJGZROBFGJXDHGRF hello bb");
		console.log(birthday);
		var todo = [id_user, gender, orientation, bio, inter, birthday];
		conn.connection.query(sql, todo, (error, result) => {
			if (error) throw error;
			isCompleted(id_user, gender, orientation, bio, interests);
		});
	}
}

function isCompleted(id_user, gender, orientation, bio, interests){
	count_photo(id_user, (result) => {
		if (gender != null && orientation != null && bio != null && interests != null && result > 0)
		{
			var sql = "UPDATE `user_info` SET `completed` = 1 WHERE `id_user` = ?";
			// console.log("liduser")
			// console.log(id_user);
			var todo = [id_user];
			conn.connection.query(sql, todo, (error, result) => {
				if (error) throw error;
			})
		}
	})
}

exports.update_info_user = function (id_user, gender, orientation, bio, interests, birthday){
	var sql = "UPDATE `user_info` SET `gender` = ?, `orientation` = ?, `bio` = ?, `interests` = ?, `birthday` = ?  WHERE `id_user` = ?";
	inter = "";
	itemsProcessed = 0;
	if (birthday == 'undefined--undefined'){birthday = null;}
	if (interests !=undefined && interests != null && Array.isArray(interests)){
		interests.forEach(function(interest) {
			if (inter == ""){
				inter += interest;
			}else{
				inter += "," + interest;
			}
			itemsProcessed++;
			if(itemsProcessed === interests.length) {
				var todo = [gender, orientation, bio, inter, birthday,  id_user];
				conn.connection.query(sql, todo, (error, result) => {
					if (error) throw error;
					isCompleted(id_user, gender, orientation, bio, interests);
				})
			}
		});
	}
	else {
		inter = interests;
		var todo = [gender, orientation, bio, inter, birthday, id_user];
		console.log(birthday);
		console.log(sql);
		conn.connection.query(sql, todo, (error, result) => {
			console.log(error);
			if (error) throw error;
			isCompleted(id_user, gender, orientation, bio, interests);
		});
	}
}

exports.is_info_user_exist = function (login, callback){
	bdd.get_id_user(login,  (id_user) => {
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

function count_photo (id_user, callback){
	var sql = "SELECT count(*) as 'count' FROM `photo` WHERE `id_user` = ?";
	var todo = [id_user];
	conn.connection.query(sql, todo, (error, result) => {
		if (error) throw error;
		// console.log(result);
		if (result[0] == undefined) {
			callback(0);
		}
		else {
			callback(result[0].count);
		}
	});
}
exports.count_photo = function count_photo (id_user, callback){
	var sql = "SELECT count(*) as 'count' FROM `photo` WHERE `id_user` = ?";
	var todo = [id_user];
	conn.connection.query(sql, todo, (error, result) => {
		if (error) throw error;
		// console.log(result);
		if (result[0] == undefined) {
			callback(0);
		}
		else {
			callback(result[0].count);
		}
	});
}

exports.savePic = function (id_user, path, profile){
	var sql = "INSERT INTO `photo` (`id_user`, `path_photo`, `profile`) VALUES (?, ?, ?);";
	var todo = [id_user, path, profile];
	// console.log("model save pic profile +>");
	// console.log(profile);
	conn.connection.query(sql, todo, (error, result) => {
		if (error) throw error;
	});
}

exports.getPic = function (id_user, callback){
	var sql = "SELECT * FROM `photo` WHERE `id_user` = ?";
	var todo = [id_user];
	conn.connection.query(sql, todo, (error, result) => {
		if (error) throw error;
		if (result[0] == undefined) {
			callback(false);
		}
		else {
			callback(result);
		}
	});
}

exports.delPic = function (path){
	var sql = "	DELETE FROM `photo` WHERE `path_photo` LIKE ?";
	var todo = [path];
	conn.connection.query(sql, todo, (error, result) => {
		if (error) throw error;
	});
}

exports.profileToZero = function (id_user, callback){
	// console.log("Profile to zero");
	var sql = "UPDATE `photo` SET `profile`= 0 WHERE `id_user` = ?";
	var todo = [id_user];
	conn.connection.query(sql, todo, (error, result) => {
		if (error) throw error;
		callback();
	});
}

exports.profileToOne = function (path, callback){
	var sql = "UPDATE `photo` SET `profile`= 1 WHERE `path_photo` LIKE ?";
	// console.log("finale path");
	// console.log(path);
	var todo = [path];
	conn.connection.query(sql, todo, (error, result) => {
		if (error) throw error;
		callback();
	});
}

exports.isProfile = function (path, callback){
	var sql = "SELECT `profile` FROM `photo` WHERE `path_photo` LIKE ?";
	var todo = [path];
	conn.connection.query(sql, todo, (error, result) => {
		if (error) throw error;
		callback(result);
	});
}
