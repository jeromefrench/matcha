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

exports.IsFieldEmpty = function IsFieldEmpty(field, callback){
	if (field == undefined || field == "" || field.indexOf(" ") > -1)
		callback(false);
	callback(true);
}

exports.check_fieldOk = function (lname, fname, mail, login, passwd, callback){
	check_noempty(lname, fname, mail, login, passwd, (i1, i2, i3, i4, i5) => {
		console.log(i1, i2, i3, i4, i5);
		check_login(login, (result1) => {
			check_mail(mail, (result2) => {
				callback(i1, i2, i3, i4, i5, result1, result2);
			});
		});
	});
}

function check_noempty(lname, fname, mail, login, passwd, callback){
	var i1 = 0;
	var i2 = 0;
	var i3 = 0;
	var i4 = 0;
	var i5 = 0;
	if (help_noempty(lname) == false){
		i1 = 1;
	}
	if (help_noempty(fname) == false){
		i2 = 1;
	}
	if (help_noempty(mail) == false){
		i3 = 1;
	}
	if (help_noempty(login) == false){
		i4 = 1;
	}
	if (help_noempty(passwd) == false){
		i5 = 1;
	}
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
			if (result[0].count != 0)
				callback(1);
			else if (result1[0].count != 0)
				callback(2);
			else
				callback(0);
		});
	});
}

function recoveruser_wmail(email, callback){
	var sql = "SELECT * FROM `user` WHERE `mail` LIKE ?";
	var todo = [email];
	conn.connection.query(sql, todo, function (err, results) {
		if (err) throw err;
		console.log(results[0]);
		callback(results[0]);
	});
}

exports.send_passwd = function (mail, callback){
	check_mail(mail, function (answer){
		if (answer == 1){
			recoveruser_wmail(mail, (user) => {
				login = user.login;
				num = getRandomInt(10000);
				console.log(login);
				console.log(num);
				var sql = "UPDATE `user` SET `num` = ? WHERE `login` LIKE ?";
				var todo = [num, login];
				conn.connection.query(sql, todo, (err, res) => {
					if (err) throw err;
					console.log("address ok et num added");
					sendmail(mail, "Forgotten password", "Clique sur ce lien pour confirmer ton inscription : <a href=\"http://localhost:8080/change-passwd/"+ login + '/' + num + "\">Changer passwd</a>");
					callback(answer);
				});
			});
		}
		else{
			callback(answer);
		}
	});
}

exports.IsLoginNumMatch = function (login, num, cat, callback){
	var sql = "SELECT COUNT(*) AS 'count' FROM `"+ cat +"` WHERE `login` LIKE ? AND `num` LIKE ?";
	var todo = [login, num];
	conn.connection.query(sql, todo, (err, result) => {
		// console.log(sql);
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

exports.insert_user = function (name, passwd, fname, lname, mail){
	var num = getRandomInt(10000);
	var sql = "INSERT INTO `user_sub` (login, passwd, lname, fname, mail, num) VALUES (?, ?, ?, ?, ?, "+ num +")";
	var todo = [name, passwd, fname, lname, mail];
	conn.connection.query(sql, todo, function (err, result) {
		if (err) throw err;
		console.log("1 record inserted");
	});
	sendmail(mail, "Subscription", "Clique sur ce lien pour confirmer ton inscription : <a href=\"http://localhost:8080/confirm/"+ name + '/' + num + "\">Confirmer</a>");
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

exports.IsNewVerifMatch = function (npass, verif, callback){
	diff = npass.localeCompare(verif, 'en', {sensitivity: 'base'});
	console.log(diff);
	if (diff == 0){
		callback(true);
	}
	else{
		callback(false);
	}
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

function sendmail(mail, subject, text){
	var transporter = mailer.createTransport({
		sendmail: true,
		newline: 'unix',
		path: '/usr/sbin/sendmail'
	});
	var letter = {
		from: emoji.emojify('Matcha\'s Team :heart: matcha@no-reply.fr'),
		to: mail,
		subject: subject,
		html: text
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
