//**********************sign-up************************************************
var conn = require('./connection_bdd.js');
var mailer = require("nodemailer");
var emoji = require('node-emoji');


function check_passwd_function(passwd){
	var letters = "abcdefghijklmnopqrstuvwxyz";
	var maj = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var numbers = "0123456789";
	var spec = "%#:$*@_-&^!>?()[]{}+=.,;";
	var l = 0;
	var m = 0;
	var n = 0;
	var s = 0;

	for(var i = 0; i < letters.length; i++){
		if (passwd.indexOf(letters.charAt(i)) != -1){
			l++;
		}
	}
	for (i = 0; i < maj.length; i++){
		if (passwd.indexOf(maj.charAt(i)) != -1){
			m++;
		}
	}
	for (i = 0; i < numbers.length; i++){
		if (passwd.indexOf(numbers.charAt(i)) != -1){
			n++;
		}
	}
	for (i = 0; i < spec.length; i++){
		if (passwd.indexOf(spec.charAt(i)) != -1){
			s++;
		}
	}
	if (l == 0 || m == 0 || n == 0 || s == 0 || passwd.length < 9){
		return false;
	}
	return true;
}

function check_login_function(login, check_login, callback){
	if (check_login == "empty"){
		callback("empty")
	}
	else{
		var sql = "SELECT COUNT(*) AS 'count' FROM `user` WHERE `login` LIKE ?";
		var todo = [login];
		conn.connection.query(sql, todo, function (err, result) {
			if (err) throw err;
			//		sql = "SELECT COUNT(*) AS 'count' FROM `user_sub` WHERE `login` LIKE ?";
			//		todo = [login];
			//conn.connection.query(sql, todo, function (err1, result1){
			//	if (err1) throw err1;
			if (result[0].count == 0){// && result1[0].count == 0){
					callback("ok");
				}
				else{
					callback("login_already_taken");
				}
			//});
		});
	}
}

function check_mail_function(mail, check_mail, callback){
	if (check_mail == "empty"){
		callback("empty")
	}
	else{
		callback("ok")
		// var sql = "SELECT COUNT(*) AS 'count' FROM `user` WHERE `mail` LIKE ?";
		// var todo = [mail];
		// conn.connection.query(sql, todo, function (err, result) {
		// 	if (err) throw err;
		// 	sql = "SELECT COUNT(*) AS 'count' FROM `user_sub` WHERE `mail` LIKE ?";
		// 	todo = [mail];
		// 	conn.connection.query(sql, todo, function (err1, result1){
		// 		if (err1) throw err1;
		// 		if (result[0].count == 0)
		// 			callback(0);
		// 		else if (result1[0].count != 0)
		// 			callback(2);
		// 		else if (result[0].count == 1){
		// 			callback('changeok');
		// 		}	
		// 		else
		// 			callback(1);
		// 	});
		// });
	}
}


function check_logAccount(login, callback){
	var sql = "SELECT COUNT(*) AS 'count' FROM `user` WHERE `login` LIKE ?";
	var todo = [login];
	conn.connection.query(sql, todo, function (err, result) {
		if (err) throw err;
		sql = "SELECT COUNT(*) AS 'count' FROM `user_sub` WHERE `login` LIKE ?";
		todo = [login];
		conn.connection.query(sql, todo, function (err1, result1){
			if (err1) throw err1;
			if (result[0].count > 1 || result1[0].count > 1){
				callback('nochange');
			}
			else{
				callback('changeok');
			}
		});
	});
}



function help_noempty(champs){
	if (champs == undefined || champs == "" || champs.indexOf(" ") > -1)
		return false;
	return true;
}

function check_noempty(lname, fname, mail, login, passwd, callback){
	var check_lname = "ok";
	var check_fname = "ok";
	var check_mail = "ok";
	var check_login = "ok";
	var check_passwd = "ok";
	if (help_noempty(lname) == false){
		i1 = "empty";
	}
	if (help_noempty(fname) == false){
		i2 = "empty";
	}
	if (help_noempty(mail) == false){
		i3 = "empty";
	}
	if (help_noempty(login) == false){
		i4 = "empty";
	}
	if (check_passwd_function(passwd) == false){
		i5 = "empty";
	}
	callback(check_lname, check_fname, check_mail, check_login, check_passwd);
}

exports.check_field_sign_up = function (lname, fname, mail, login, passwd, callback){
	check_noempty(lname, fname, mail, login, passwd, (check_lname, check_fname, check_mail, check_login, check_passwd) => {
		check_login_function(login, check_login, (check_login) => {
			check_mail_function(mail, check_mail,  (check_mail) => {
				callback(check_lname, check_fname, check_mail, check_login, check_passwd);
			});
		});
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

exports.insert_user = function (name, passwd, fname, lname, mail){
	var num = getRandomInt(10000);
	var sql = "INSERT INTO `user_sub` (login, passwd, lname, fname, mail, num) VALUES (?, ?, ?, ?, ?, "+ num +")";
	var todo = [name, passwd, lname, fname, mail];
	conn.connection.query(sql, todo, function (err, result) {
		if (err) throw err;
		console.log("1 record inserted");
	});
	sendmail(mail, "Subscription", "Clique sur ce lien pour confirmer ton inscription : <a href=\"http://localhost:8080/confirm/"+ name + '/' + num + "\">Confirmer</a>");
}


//**********************sign-up************************************************

