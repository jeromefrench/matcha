var conn = require('./connection_bdd.js');
var mailer = require("nodemailer");
var emoji = require('node-emoji');


conn.connection.connect(function(err) {
	if (err) {
	  	console.error('error connecting: ' + err.stack);
	  	return;
	}
	console.log('connected as id ' + conn.connection.threadId);
});

exports.get_user = function (){
	conn.connection.query('SELECT * FROM `user` ', function (error, results, fields) {
		console.log(results);
		return results;
	});
}

function help_noempty(champs){
	if (champs == undefined || champs == "" || champs.indexOf(" ") > -1)
		return false;
	return true;
}

exports.check_noempty = function (lname, fname, mail, login, passwd, callback){
	var i1 = 0;
	var i2 = 0;
	var i3 = 0;
	var i4 = 0;
	var i5 = 0;
	if (help_noempty(lname) == false)
		i1 = 1;
	if (help_noempty(fname) == false)
		i2 = 1;
	if (help_noempty(mail) == false)
		i3 = 1;
	if (help_noempty(login) == false)
		i4 = 1;
	if (help_noempty(passwd) == false)
		i5 = 1;
	callback(i1, i2, i3, i4, i5);
}

exports.check_log = function (login, callback){
	var sql = "SELECT COUNT(*) AS 'count' FROM `user` WHERE `login` LIKE ?";
	var todo = [login];
	conn.connection.query(sql, todo, function (err, result) {
		if (err) throw err;
		sql = "SELECT COUNT(*) AS 'count' FROM `user_sub` WHERE `login` LIKE ?";
		todo = [login];
		conn.connection.query(sql, todo, function (err1, result1){
			if (err1) throw err1;
			console.log(result[0].count);
			console.log(result1[0].count);
			callback(result[0].count, result1[0].count);
		});
	});
}

function check_login(login, callback){
	var sql = "SELECT COUNT(*) AS 'count' FROM `user` WHERE `login` LIKE ?";
	var todo = [login];
	conn.connection.query(sql, todo, function (err, result) {
		if (err) throw err;
		sql = "SELECT COUNT(*) AS 'count' FROM `user_sub` WHERE `login` LIKE ?";
		todo = [login];
		conn.connection.query(sql, todo, function (err1, result1){
			if (err1) throw err1;
			if (result[0].count != 0 || result1[0].count != 0){
				callback(true);
			}
			else{
				callback(false);
			}
		});
	});
}

function check_mail(mail, callback){
	var sql = "SELECT COUNT(*) AS 'count' FROM `user` WHERE `mail` LIKE ?";
	var todo = [mail];
	conn.connection.query(sql, todo, function (err, result) {
		if (err) throw err;
		sql = "SELECT COUNT(*) AS 'count' FROM `user_sub` WHERE `mail` LIKE ?";
		todo = [mail];
		conn.connection.query(sql, todo, function (err1, result1){
			if (err1) throw err1;
			console.log(result1[0].count);
			if (result[0].count != 0)
				callback(1);
			else if (result1[0].count != 0)
				callback(2);
			else
				callback(0);
		});
	});
}

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

exports.insert_user = function (name, passwd, fname, lname, mail, callback){
	var result1 = 0;
	var result2 = 0;
	var num = getRandomInt(10000);
	check_login(name, function (answer){
		if (answer)
			result1 = 1;
		else
			result1 = 0;
		check_mail(mail, function (answer){
			if (answer == 1)
				result2 = 1;
			else if (answer == 2)
				result2 = 2;
			else
				result2 = 0;
			if (result1 == 0 && result2 == 0){
				var sql = "INSERT INTO `user_sub` (login, passwd, lname, fname, mail, num) VALUES (?, ?, ?, ?, ?, "+ num +")";
				var todo = [name, passwd, fname, lname, mail];
				conn.connection.query(sql, todo, function (err, result) {
					if (err) throw err;
					console.log("1 record inserted");
				});
				sendmail(name, num, mail);
			}
			callback(result1, result2);
		});
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

exports.insert_info = function (id_user, gender, orientation, bio) {
	var sql = "INSERT INTO `info_user` (id_user, gender, orientation, bio) VALUES (?, ?, ?, ?)";
	var todo = [id_user, gender, orientation, bio];
	conn.connection.query(sql, todo, (error, result) => {
		if (error) throw error;
		console.log("infos added");
	});
}

exports.isLoginPasswdMatch = function (login, passwd, callback){
	var  sql = 'SELECT * FROM `user` WHERE `login` LIKE ? ';
	var todo = [login];
	var stop = false;
	conn.connection.query(sql, todo, (error, results, fields) => {
		if (error) throw error;
		console.log(results);
		console.log(results[0].login);
		if (results[0].passwd == passwd) {
            callback(true) ;
		}
		else {
            callback(false) ;
		}
	});
	// console.log("ici");
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

function sendmail(login, num, mail){
	var transporter = mailer.createTransport({
		sendmail: true,
		newline: 'unix',
		path: '/usr/sbin/sendmail'
	});
	var letter = {
		from: emoji.emojify('Matcha\'s Team :heart: matcha@no-reply.fr'),
		to: mail,
		subject: 'Subscription',
		html: 'Clique sur ce lien pour confirmer ton inscription : <a href="http://localhost:8080/confirm/'+ login + '/' + num + '">Confirmer</a>'
	}
	transporter.sendMail(letter, (err, res) => {
		if (err){
			console.log("Erreur lors de l'envoi du mail");
			console.log(err);
		}
		else
			console.log("Mail envoyé avec succès !");
		transporter.close();
	});
}

function getRandomInt(max){
	return Math.floor(Math.random() * Math.floor(max));
}



		// Object.keys(results).forEach(function(key){
		//  	var row = results[key];
		// 	console.log(row.id);
		// 	if (row.passwd == passwd)
		// 	{
		// 		myEvent.emit('endPasswordMatch', true);
		// 		stop = true;
		// 		return;
		// 	}
		// });
		// if (stop == true)
		// 	return;
		// myEvent.emit('endPasswordMatch', false);
		// return;
