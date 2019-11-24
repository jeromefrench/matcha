var conn = require('./connection_bdd.js');

exports.check_log = function (login, callback){
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

exports.isLoginPasswdMatch = function (login, passwd, callback){
	var  sql = 'SELECT * FROM `user` WHERE `login` LIKE ? ';
	var todo = [login];
	var stop = false;
	conn.connection.query(sql, todo, (error, results, fields) => {
		if (error) throw error;
		// console.log(results);
		// console.log(results[0].login);
		if (results[0].passwd == passwd) {
            callback(true) ;
		}
		else {
            callback(false) ;
		}
	});
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
