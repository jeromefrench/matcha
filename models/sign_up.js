var conn = require('./connection_bdd.js');
var mailer = require("nodemailer");
var emoji = require('node-emoji');

function help_noempty(champs){
	if (champs == undefined || champs == "" || champs.indexOf(" ") > -1)
		return false;
	return true;
}

function check_passwd(passwd){
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

function check_noempty(lname, fname, mail, login, passwd, callback){
	var i1 = 0;
	var i2 = 0;
	var i3 = 0;
	var i4 = 0;
	var i5 = 0;
	console.log("checkpass = " + check_passwd(passwd));
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
	if (check_passwd(passwd) == false){
		i5 = 1;
	}
	callback(i1, i2, i3, i4, i5);
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

exports.check_fieldOk = function (lname, fname, mail, login, passwd, callback){
	check_noempty(lname, fname, mail, login, passwd, (i1, i2, i3, i4, i5) => {
		check_login(login, (result1) => {
			check_mail(mail, (result2) => {
				callback(i1, i2, i3, i4, i5, result1, result2);
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

