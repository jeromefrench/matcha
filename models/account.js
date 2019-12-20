var conn = require('./connection_bdd.js');
var bdd = require('../models/bdd_functions.js');
const bcrypt = require('bcrypt');
var mailer = require("nodemailer");
var emoji = require('node-emoji');

//**********************sign-in************************************************
exports.checkLoginSignIn = function (login, callback){
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
				console.log(count_user[0].count);
				console.log(count_user_sub[0].count);
				if (err1) throw err1;
				if (count_user[0].count > 0){
					callback("ok");
				}
				else if (count_user_sub[0].count > 0){
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
					callback("match") ;
				}
				else{
					callback("dont_match") ;
				}
			});
		});
	}
}

exports.save_connection_log = function (login){
	bdd.get_id_user(login, (id_user) => {
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
	});
}

exports.notification = function (login, callback){
	bdd.get_id_user(login, (id_user) => {
		var sql = "SELECT COUNT(*) AS 'count' FROM `notifications` WHERE `id_user_i_send` = ? AND `lu` = 0";
		var todo = [id_user];
		conn.connection.query(sql, todo, (err, tab) => {
			if (err) {
				console.log(err);
			}
			if (tab[0].count == 0){
				bell = 0;
			}
			else{
				bell = 1;
			}
			callback(id_user)
		});
	});
}

//**********************sign-up************************************************
exports.check_field_sign_up = function (lname, fname, mail, login, passwd, verif, callback){
	check_noempty(lname, fname, mail, login, (check_lname, check_fname, check_mail, check_login) => {
		check_login_function(login, check_login, (check_login) => {
			check_mail_function(mail, check_mail,  (check_mail) => {
				check_passwd_sign_up(passwd, verif, (check_passwd) => {
					callback(check_lname, check_fname, check_mail, check_login, check_passwd);
				});
			});
		});
	});
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
//**********************my-account************************************************

exports.recover_user_ = function (login, callback){
	var sql = "SELECT * FROM `user`  WHERE `login` LIKE ?";
	var todo = [login];
	conn.connection.query(sql, todo, function (err, results) {
		if (err) throw err;
		callback(results);
	});
}

exports.check_field_my_account = function (old_login, lname, fname, mail, login, passwd, verif, callback){
	check_noempty(lname, fname, mail, login, (check_lname, check_fname, check_mail, check_login) => {
		check_login_function_my_account(old_login, login, check_login, (check_login) => {
			check_mail_function(mail, check_mail,  (check_mail) => {
				check_passwd_function(passwd, verif, (check_passwd) => {
					callback(check_lname, check_fname, check_mail, check_login, check_passwd);
				})
			});
		});
	});
}

exports.update_user = function (lname, fname, mail, login, old_login){
    var sql = "UPDATE `user` SET `lname` = ?, `fname` = ?, `mail` = ?, `login`= ? WHERE `login` = ?";
	var todo = [lname, fname, mail, login, old_login];
	conn.connection.query(sql, todo, function (err, result) {
		if (err) throw err;
	});
}

//**********************my-account************************************************
//*****************forgotten passwd*******************************************


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

//*****************forgotten passwd*******************************************
//************change-passwd****************************************************
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

exports.IsFieldOk = function (npass, verif, callback){
	check_passwd_sign_up(npass, verif, (check_passwd) => {
		callback(check_passwd);
	});
}

exports.changePass = function (login, npass){
	var sql = "UPDATE `user` SET `passwd` = ? WHERE `login` LIKE ?";
	var todo = [npass, login];
	conn.connection.query(sql, todo, (err, result) => {
		if (err) throw err;
		console.log("pass changé !");
	});
}

//************change-passwd****************************************************
//**********************confirm************************************************
//IsLoginNumMatch
//save_connection_log
//notification

exports.recover_user_data = function (num, callback){
	var sql = "SELECT * FROM `user_sub` WHERE `num` LIKE ?";
	var todo = [num];
	conn.connection.query(sql, todo, (err, res) => {
		if (err) throw err;
		callback(res[0]);
	});
}

exports.valide_user = function (login, passwd, lname, fname, mail, num, callback){
	var sql = "INSERT INTO `user` (login, passwd, fname, lname, mail) VALUES (?, ?, ?, ?, ?)";
	var todo = [login, passwd, fname, lname, mail];
	conn.connection.query(sql, todo, (err, res) => {
		if (err) throw err;
	});
	sql = "DELETE FROM `user_sub` WHERE `login` LIKE ?";
	todo = [login];
	conn.connection.query(sql, todo, (err, res) => {
		if (err) throw err;
		callback("");
	});
}

//**********************confirm************************************************
//*****************************************************************************



function check_passwd_function(passwd, verif, callback){
	if (passwd == verif && verif == ""){
		callback("ok");
	}
	else if (passwd != verif){
		callback("passwd_different");
	}
	else if (passwd == verif){
		check = check_passwd(passwd);
		if (check == true){
			callback("change_passwd")
		}
		else {
			callback("wrong_format");
		}
	}
}

function check_login_function_my_account(old_login, login, check_login, callback){
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
			if (old_login == login){
					callback("ok");
			}
			else if (result[0].count == 0){// && result1[0].count == 0){
					callback("ok");
			}
			else{
				callback("login_already_taken");
			}
			//});
		});
	}
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

function check_mail(mail, callback){
	var sql = "SELECT COUNT(*) AS 'count' FROM `user` WHERE `mail` LIKE ?";
	var todo = [mail];
	conn.connection.query(sql, todo, function (err, result) {
		if (err) throw err;
		sql = "SELECT COUNT(*) AS 'count' FROM `user_sub` WHERE `mail` LIKE ?";
		todo = [mail];
		conn.connection.query(sql, todo, function (err1, result1){
			if (err1) throw err1;
			if (result[0].count == 0)
				callback(0);
			else if (result1[0].count != 0)
				callback(2);
			else if (result[0].count == 1){
				callback('changeok');
			}	
			else
				callback(1);
		});
	});
}

function check_passwd_sign_up(passwd, verif, callback){
	if (passwd != verif){
		callback("passwd_different");
	}
	else if (passwd == verif && (verif == "" || verif == " ")){
		callback("empty");
	}
	else if (passwd == verif){
		check = check_passwd(passwd);
		if (check == true){
			callback("ok")
		}
		else {
			callback("wrong_format");
		}
	}
}

function check_mail_function(mail, check_mail, callback){
	if (check_mail == "empty"){
		callback("empty");
	}
	else{
		callback("ok");
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

function help_noempty(champs){
	if (champs == undefined || champs == "" || champs.indexOf(" ") > -1)
		return false;
	return true;
}

function check_noempty(lname, fname, mail, login, callback){
	var check_lname = "ok";
	var check_fname = "ok";
	var check_mail = "ok";
	var check_login = "ok";
	if (help_noempty(lname) == false){
		check_lname = "empty";
	}
	if (help_noempty(fname) == false){
		check_fname = "empty";
	}
	if (help_noempty(mail) == false){
		check_mail = "empty";
	}
	if (help_noempty(login) == false){
		check_login = "empty";
	}
	callback(check_lname, check_fname, check_mail, check_login);
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

function recoveruser_wmail(email, callback){
	var sql = "SELECT * FROM `user` WHERE `mail` LIKE ?";
	var todo = [email];
	conn.connection.query(sql, todo, function (err, results) {
		if (err) throw err;
		console.log(results[0]);
		callback(results[0]);
	});
}


// exports.check_log = function (login, callback){
// 	if (help_noempty(login) == false){
// 		callback('vide','vide');
// 	}
// 	else{
// 		var sql = "SELECT COUNT(*) AS 'count' FROM `user` WHERE `login` LIKE ?";
// 		var todo = [login];
// 		conn.connection.query(sql, todo, function (err, result) {
// 			if (err) throw err;
// 			sql = "SELECT COUNT(*) AS 'count' FROM `user_sub` WHERE `login` LIKE ?";
// 			todo = [login];
// 			conn.connection.query(sql, todo, function (err1, result1){
// 				if (err1) throw err1;
// 				callback(result[0].count, result1[0].count);
// 			});
// 		});
// 	}
// }

// exports.change_log_mail = function(oldlog, login, email, lname, fname, callback){
//     console.log("oldlog = " + oldlog);
//     console.log("log = " + login);
//     console.log("email = " + email);
//     var sql = "UPDATE `user` SET `login` = ?, `mail` = ?, `fname` = ?, `lname`= ? WHERE `login` = ?";
//     var todo = [login, email, fname, lname, oldlog];
//     conn.connection.query(sql, todo, (err) => {
//         if (err){console.log(err);}
//         else {
//             console.log("USER UPDATED");
//             callback();
//         }
//     });
// }


// exports.update_user_and_passwd = function (lname, fname, email, login, passwd,  old_login){
//     var sql = "UPDATE `user` SET `lname` = ?, `fname` = ?, `email` = ?, `login`= ? , `passwd`= ? WHERE `login` = ?";
// 	var todo = [lname, fname, email, login, passwd, old_login];
// 	conn.connection.query(sql, todo, function (err, result) {
// 		if (err) throw err;
// 	});
// }

// exports.valide_user_fake = function (login, passwd, lname, fname, mail, callback){
// 	var sql = "INSERT INTO `user` (login, passwd, fname, lname, mail) VALUES (?, ?, ?, ?, ?)";
// 	var todo = [login, passwd, fname, lname, mail];
// 	conn.connection.query(sql, todo, (err, res) => {
// 		if (err) throw err;
// 		console.log(login + "added in user");
// 		callback();
// 	});
// 	// sql = "DELETE FROM `user_sub` WHERE `login` LIKE ?";
// 	// todo = [login];
// 	// conn.connection.query(sql, todo, (err, res) => {
// 		// if (err) throw err;
// 		// console.log(login + "deleted from user_sub");
// 	// });
// }

