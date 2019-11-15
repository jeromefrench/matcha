var conn = require('./connection_bdd.js');
var mailer = require("nodemailer");
var emoji = require('node-emoji');

exports.IsLoginNumMatch = function (login, num, cat, callback){
	var sql = "SELECT COUNT(*) AS 'count' FROM `"+ cat +"` WHERE `login` LIKE ? AND `num` LIKE ?";
	var todo = [login, num];
	conn.connection.query(sql, todo, (err, result) => {
		if (result[0].count == 0){
			callback(false);
			console.log("login num pas ok");
		}
		else{
			callback(true);
			console.log("login num ok");
		}
	});
}

exports.get_id_user = function (login, callback){
	var sql = "SELECT `id` FROM `user` WHERE `login` LIKE ?";
	var todo = [login];
	conn.connection.query(sql, todo, (error, result) => {
		if (error) throw error;
		callback(result[0].id);
	});
}

exports.insert_message = function (content, date){
	var sql = "INSERT INTO messages (content, createat) VALUES (?, ?)";
	var todo = [content, date];
	conn.connection.query(sql, todo, function (err, result) {
	  	if (err) throw err;
	  	console.log("1 record inserted");
	});
}

exports.recover_user = function (login, callback){
	var sql = "SELECT * FROM `user` WHERE `login` LIKE ?";
	var todo = [login];
	conn.connection.query(sql, todo, function (err, results) {
		if (err) throw err;
		console.log(results[0].login);
		callback(results);
	});
}