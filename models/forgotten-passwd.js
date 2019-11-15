var conn = require('./connection_bdd.js');
var mailer = require("nodemailer");
var emoji = require('node-emoji');

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

function getRandomInt(max){
	return Math.floor(Math.random() * Math.floor(max));
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

exports.send_passwd = function (mail, callback){
	check_mail(mail, function (answer){
		if (answer == 1){
			recoveruser_wmail(mail, (user) => {
				login = user.login;
				num = getRandomInt(10000);
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