var conn = require('./connection_bdd.js');

exports.recover_user_data = function (num, callback){
	var sql = "SELECT * FROM `user_sub` WHERE `num` LIKE ?";
	var todo = [num];
	conn.connection.query(sql, todo, (err, res) => {
		if (err) throw err;
		callback(res[0]);
	});
}

exports.valide_user = function (login, passwd, lname, fname, mail, num){
	var sql = "INSERT INTO `user` (login, passwd, fname, lname, mail) VALUES (?, ?, ?, ?, ?)";
	var todo = [login, passwd, fname, lname, mail];
	conn.connection.query(sql, todo, (err, res) => {
		if (err) throw err;
		console.log(login + "added in user");
	});
	sql = "DELETE FROM `user_sub` WHERE `login` LIKE ?";
	todo = [login];
	conn.connection.query(sql, todo, (err, res) => {
		if (err) throw err;
		console.log(login + "deleted from user_sub");
	});
}

exports.valide_user_fake = function (login, passwd, lname, fname, mail, callback){
	var sql = "INSERT INTO `user` (login, passwd, fname, lname, mail) VALUES (?, ?, ?, ?, ?)";
	var todo = [login, passwd, fname, lname, mail];
	conn.connection.query(sql, todo, (err, res) => {
		if (err) throw err;
		console.log(login + "added in user");
		callback();
	});
	// sql = "DELETE FROM `user_sub` WHERE `login` LIKE ?";
	// todo = [login];
	// conn.connection.query(sql, todo, (err, res) => {
		// if (err) throw err;
		// console.log(login + "deleted from user_sub");
	// });
}
