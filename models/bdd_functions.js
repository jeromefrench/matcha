var conn = require('./connection_bdd.js');
var mailer = require("nodemailer");


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

function check_login(login, callback){
	var sql = "SELECT COUNT(*) AS 'count' FROM `user` WHERE `login` LIKE ?";
	var todo = [login];
	conn.connection.query(sql, todo, function (err, result) {
		if (err) throw err;
		if (result[0].count != 0)
			callback(true);
		else
			callback(false);
	});
};

function check_mail(mail, callback){
	var sql = "SELECT COUNT(*) AS 'count' FROM `user` WHERE `mail` LIKE ?";
	var todo = [mail];
	conn.connection.query(sql, todo, function (err, result) {
		if (err) throw err;
		if (result[0].count != 0)
			callback(true);
		else
			callback(false);
	});
};

exports.insert_user = function (name, passwd, fname, lname, mail, callback){
	var result1 = 0;
	var result2 = 0;
	check_login(name, function (answer){
		if (answer)
			result1 = 1;
		else
			result1 = 0;
		check_mail(mail, function (answer){
			if (answer)
				result2 = 1;
			else
				result2 = 0;
			if (result1 == 0 && result2 == 0){
				sendmail(mail);
			// 	var sql = "INSERT INTO user (login, passwd, fname, lname, mail) VALUES (?, ?, ?, ?, ?)";
			// 	var todo = [name, passwd, fname, lname, mail];
			// 	conn.connection.query(sql, todo, function (err, result) {
			// 		if (err) throw err;
			// 		console.log("1 record inserted");
			// 	});
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
	console.log("ici");
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

function sendmail(mail){
	var transporter = mailer.createTransport({
		sendmail: true,
		newline: 'unix',
		path: '/usr/sbin/sendmail'
	});
	var letter = {
		from: 'matcha42.jeronemo@gmail.com',
		to: mail,
		subject: 'Subscription',
		text: 'Clique sur ce lien pour confirmer ton inscription : '
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
