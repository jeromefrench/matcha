var conn = require('./connection_bdd.js');
const bcrypt = require('bcrypt');

	//empty
	//login no exist
	//need confirm
	//ok
exports.check_login = function (login, callback){
	if (login == undefined || login == "" || login.indexOf(" ") > -1){
		callback("empty");
	}
	else{
		var sql = "SELECT COUNT(*) AS 'count' FROM `user` WHERE `login` LIKE ?";
		var todo = [login];
		conn.connection.query(sql, todo, function (err, count_user) {
			if (err) throw err;
			sql = "SELECT COUNT(*) AS 'count' FROM `user_sub` WHERE `login` LIKE ?";
			todo = [login];
			conn.connection.query(sql, todo, function (err1, count_user_sub){
				if (err1) throw err1;
				if (count_user > 0){
					callback("ok");
				}
				else if (count_user_sub > 0){
					callback("need_confirm");
				}
				else{
					callback("login_no_exist");
				}
			});
		});
	}
}

exports.isLoginPasswdMatch = async function isMatch (login, passwd, callback){
	if (passwd == undefined || passwd == "" || passwd.indexOf(" ") > -1){
		callback("empty");
	}
	else{
		var  sql = 'SELECT * FROM `user` WHERE `login` LIKE ? ';
		var todo = [login];
		conn.connection.query(sql, todo, (error, results, fields) => {
			if (error) throw error;
			bcrypt.compare(passwd, results[0].passwd , function(err, res) {
				if(res) {
					callback(true) ;
				}
				else{
					callback(false) ;
				}
			});
		});
	}
}


function help_noempty(champs){
	if (champs == undefined || champs == "" || champs.indexOf(" ") > -1)
		return false;
	return true;
}


exports.check_log = function (login, callback){
	if (help_noempty(login) == false){
		callback('vide','vide');
	}
	else{
		var sql = "SELECT COUNT(*) AS 'count' FROM `user` WHERE `login` LIKE ?";
		var todo = [login];
		conn.connection.query(sql, todo, function (err, result) {
			if (err) throw err;
			sql = "SELECT COUNT(*) AS 'count' FROM `user_sub` WHERE `login` LIKE ?";
			todo = [login];
			conn.connection.query(sql, todo, function (err1, result1){
				if (err1) throw err1;
				callback(result[0].count, result1[0].count);
			});
		});
	}
}


exports.save_connection_log = function (id_user){
	var  sql = 'SELECT * FROM `connection_log` WHERE `id_user` = ? ';
	var todo = [id_user];
	var stop = false;
	conn.connection.query(sql, todo, (error, results, fields) => {
		if (error) throw error;
		if (!results[0]) {
			var  sql = 'INSERT INTO `connection_log` (`id_user`, `last_visit`) VALUES (?, ?)';
			date = new Date();
			var todo = [id_user, date];
			conn.connection.query(sql, todo, (error, results, fields) => {
				if (error) throw error;
			})
		}
		else {
			var sql = 'UPDATE `connection_log` SET `last_visit` = ? WHERE `connection_log`.`id` = ?';
			date = new Date();
			var todo = [date, id_user];
			conn.connection.query(sql, todo, (error, results, fields) => {
				if (error) throw error;
			})
		}
	});
}
