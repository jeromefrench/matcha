const bcrypt = require('bcrypt');
var mailer = require("nodemailer");
var emoji = require('node-emoji');
const jwt = require('jsonwebtoken');


//**********************connection**********************************************
// const util = require( 'util' );
// const mysql = require( 'mysql' );

// config = { host     : 'localhost',
// 			user     : 'newuser',
// 			password : 'rootpasswd',
// 			port	: '3306',
// 			database : 'docker' };

// function makeConn(config){
//   const connection = mysql.createConnection( config );
//   return {
//     query( sql, args ) {
//       return util.promisify( connection.query )
//         .call( connection, sql, args );
//     },
//     close() {
//       return util.promisify( connection.end ).call( connection );
//     }
//   };
// }


// db = makeConn(config);

//**********************sign-in************************************************
exports.checkLoginSignIn = async function (login){
try {
	if (login == undefined || login == "" || login.indexOf(" ") > -1){
		return ("empty");
	}
	else{
		var sql = "SELECT COUNT(*) AS 'count' FROM `user` WHERE `login` LIKE ?";
		var todo = [login];
		count_user = await db.query(sql, todo);
		sql = "SELECT COUNT(*) AS 'count' FROM `user_sub` WHERE `login` LIKE ?";
		todo = [login];
		count_user_sub = await db.query(sql, todo);
		if (count_user[0].count > 0){
			return "ok";
		}
		else if (count_user_sub[0].count > 0){
			return "need_confirm";
		}
		else{
			return "login_no_exist";
		}
	}
}
catch (err){
	console.log("erreur ici");
	console.log(err);
		return (err);
	}
}

exports.isLoginPasswdMatch = async function isMatch (login, passwd){
	try {
		if (passwd == undefined || passwd == "" || passwd.indexOf(" ") > -1){
			return "empty";
		}
		else{
			var  sql = 'SELECT * FROM `user` WHERE `login` LIKE ? ';
			var todo = [login];
			results = await db.query(sql, todo);

			res = await bcrypt.compare(passwd, results[0].passwd);
			if(res) {
				return "match";
			}
			else{
				return "dont_match";
			}
		}
	}
	catch (err){
		return err;
	}
}

exports.connect_user = async function (login, req){
	req.session.first_log = true;
	req.session.logon = true;
	req.session.login = login;
	done = await save_connection_log(login);
	user_id = await notification(login);
	const user = { id: user_id, username: login};
	let jwtToken = jwt.sign(user, 'secretkey');
	req.session.token = jwtToken;
	return "done";
}

//**********************sign-up************************************************
exports.check_field_sign_up = async function (field){
	try{
		check_field = check_noempty(field);
		check_field['login'] = await check_login_function(field['login'], check_field['login']);
		check_field['mail'] = await check_mail_function(field['mail'], check_field['mail']);
		check_field['passwd'] = check_passwd_sign_up(field['passwd'], field['verif']);
		return (check_field);
	}catch (err){
		return err;
	}
}

exports.insert_user = async function (field, passwd){
	var num = getRandomInt(10000);
	var sql = "INSERT INTO `user_sub` (login, passwd, lname, fname, mail, num) VALUES (?, ?, ?, ?, ?, "+ num +")";
	var todo = [field['login'], passwd, field['lname'], field['fname'], field['mail'], num];
	result = await db.query(sql, todo);
	sendmail(field['mail'], "Subscription", "Clique sur ce lien pour confirmer ton inscription : <a href=\"http://localhost:8080/confirm/"+ field['login'] + '/' + num + "\">Confirmer</a>");
	return "done";
}

//**********************sign-up************************************************
//**********************my-account************************************************

exports.recover_user_ = async function (login){
	var sql = "SELECT * FROM `user`  WHERE `login` LIKE ?";
	var todo = [login];
	results = await db.query(sql, todo);
	return (results[0]);
}

exports.check_field_my_account = async function (old_login, field){
	check_field = check_noempty(field);
	check_field['login'] = await check_login_function_my_account(old_login, field['login'], check_field['login']);
	check_field['mail'] = check_mail_function(field['mail'], "check_mail");
	check_field['passwd'] = check_passwd_function(passwd, verif);
	return (check_field);
}

exports.update_user = async function (lname, fname, mail, login, old_login){
    var sql = "UPDATE `user` SET `lname` = ?, `fname` = ?, `mail` = ?, `login`= ? WHERE `login` = ?";
	var todo = [lname, fname, mail, login, old_login];
	result = await db.query(sql, todo);
	return "done";
}

//**********************my-account************************************************
//*****************forgotten passwd*******************************************

exports.send_passwd = async function (mail){
	answer = await check_mail(mail);
	if (answer == "change_ok"){
		user = await recoveruser_wmail(mail);
		login = user.login;
		num = getRandomInt(10000);
		var sql = "UPDATE `user` SET `num` = ? WHERE `login` LIKE ?";
		var todo = [num, login];
		res = await db.query(sql, todo);
		sendmail(mail, "Forgotten password", "Clique sur ce lien pour confirmer ton inscription : <a href=\"http://localhost:8080/change-passwd/"+ login + '/' + num + "\">Changer passwd</a>");
		return (answer);
	}
	else{
		return (answer);
	}
}

//*****************forgotten passwd*******************************************
//************change-passwd****************************************************
exports.IsLoginNumMatch = async function (login, num, cat){
	var sql = "SELECT COUNT(*) AS 'count' FROM `"+ cat +"` WHERE `login` LIKE ? AND `num` LIKE ?";
	var todo = [login, num];
	result = await db.query(sql, todo);
	if (result[0].count == 0){
		return (false);
	}
	else{
		return (true);
	}
}

exports.IsFieldOk = function (npass, verif){
	check_passwd = check_passwd_sign_up(npass, verif);
	return (check_passwd);
}

exports.changePass = function (login, npass){
	var sql = "UPDATE `user` SET `passwd` = ? WHERE `login` LIKE ?";
	var todo = [npass, login];
	conn.connection.query(sql, todo, (err, result) => {
		if (err) throw err;
	});
}

//************change-passwd****************************************************
//**********************confirm************************************************
//IsLoginNumMatch
//save_connection_log
//notification

exports.recover_user_data = async function (num, callback){
	var sql = "SELECT * FROM `user_sub` WHERE `num` LIKE ?";
	var todo = [num];
	res = await db.query(sql, todo);
	return (res[0]);
}

exports.valide_user = async function (login, passwd, lname, fname, mail, num){
	var sql = "INSERT INTO `user` (login, passwd, fname, lname, mail) VALUES (?, ?, ?, ?, ?)";
	var todo = [login, passwd, fname, lname, mail];
	res = await db.query(sql, todo);
	sql = "DELETE FROM `user_sub` WHERE `login` LIKE ?";
	todo = [login];
	res = await db.query(sql, todo);
	return("");
}

//**********************confirm************************************************
//*****************************************************************************

function check_passwd_function(passwd, verif){
	if (passwd == verif && verif == ""){
		return ("ok");
	}
	else if (passwd != verif){
		return ("passwd_different");
	}
	else if (passwd == verif){
		check = check_passwd(passwd);
		if (check == true){
			return ("change_passwd")
		}
		else {
			return ("wrong_format");
		}
	}
}

async function check_login_function_my_account(old_login, login, check_login){
	if (check_login == "empty"){
		return ("empty")
	}
	else{
		var sql = "SELECT COUNT(*) AS 'count' FROM `user` WHERE `login` LIKE ?";
		var todo = [login];
		result = await db.query(sql, todo)
		//		sql = "SELECT COUNT(*) AS 'count' FROM `user_sub` WHERE `login` LIKE ?";
		//		todo = [login];
		//conn.connection.query(sql, todo, function (err1, result1){
		//	if (err1) throw err1;
		if (old_login == login){
			return ("ok");
		}
		else if (result[0].count == 0){// && result1[0].count == 0){
			return ("ok");
		}
		else{
			return ("login_already_taken");
		}
	}
}

async function check_login_function(login, check_login, callback){
	try {
		if (check_login == "empty"){
			return ("empty")
		}
		else{
			var sql = "SELECT COUNT(*) AS 'count' FROM `user` WHERE `login` LIKE ?";
			var todo = [login];
			result = await db.query(sql, todo);
			//		sql = "SELECT COUNT(*) AS 'count' FROM `user_sub` WHERE `login` LIKE ?";
			//		todo = [login];
			//conn.connection.query(sql, todo, function (err1, result1){
			//	if (err1) throw err1;
			if (result[0].count == 0){// && result1[0].count == 0){
				return ("ok");
			}
			else{
				return ("login_already_taken");
			}
			//});
		}
	} catch (err) {
	 	return (err);
	}
}

async function check_mail(mail){
	var sql = "SELECT COUNT(*) AS 'count' FROM `user` WHERE `mail` LIKE ?";
	var todo = [mail];
	result1 = await db.query(sql, todo);
	if (result[0].count == 0){
		return (0);
	}
	else if (result1[0].count != 0){
		return (2);
	}
	else if (result[0].count == 1){
		return ('change_ok');
	}
	else{
		return (1);
	}
}

function check_passwd_sign_up(passwd, verif){
	if (passwd != verif){
		return ("passwd_different");
	}
	else if (passwd == verif && (verif == "" || verif == " ")){
		return ("empty");
	}
	else if (passwd == verif){
		check = check_passwd(passwd);
		if (check == true){
			return ("ok")
		}
		else {
			return ("wrong_format");
		}
	}
}

function help_noempty(champs){
	if (champs == undefined || champs == "" || champs.indexOf(" ") > -1)
		return false;
	return true;
}

function check_noempty(field){
	check_field = {};
	check_field['lname'] = "ok";
	check_field['fname'] = "ok";
	check_field['mail'] = "ok";
	check_field['login'] = "ok";
	if (help_noempty(field['lname']) == false){
		check_field['lname']= "empty";
	}
	if (help_noempty(field['fname']) == false){
		check_field['fname'] = "empty";
	}
	if (help_noempty(field['mail']) == false){
		check_field['mail'] = "empty";
	}
	if (help_noempty(field['login']) == false){
		check_field['login'] = "empty";
	}
	return check_field;
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
			console.log(err);
		}
		else
		transporter.close();
	});
}

function getRandomInt(max){
	return Math.floor(Math.random() * Math.floor(max));
}

async function recoveruser_wmail(email){
	var sql = "SELECT * FROM `user` WHERE `mail` LIKE ?";
	var todo = [email];
	results = await db.query(sql, todo);
	return (results[0]);
}

async function notification (login){
	try{
		id_user = await get_id_user(login);
		var sql = "SELECT COUNT(*) AS 'count' FROM `notifications` WHERE `id_user_i_send` = ? AND `lu` = 0";
		var todo = [id_user];
		tab = await db.query(sql, todo);
		if (tab[0].count == 0){
			bell = 0;
		}
		else{
			bell = 1;
		}
		return (id_user)
	}
	catch {
		return err;
	}
}

async function save_connection_log (login){
	id_user = await get_id_user(login);
	var  sql = 'SELECT * FROM `connection_log` WHERE `id_user` = ? ';
	var todo = [id_user];
	var stop = false;
	results = await db.query(sql, todo);
	if (!results[0]) {
		var  sql = 'INSERT INTO `connection_log` (`id_user`, `last_visit`) VALUES (?, ?)';
		date = new Date();
		var todo = [id_user, date];
		results = await db.query(sql, todo);
		return "done";
	}
	else {
		var sql = 'UPDATE `connection_log` SET `last_visit` = ? WHERE `connection_log`.`id` = ?';
		date = new Date();
		var todo = [date, id_user];
		results = await db.query(sql, todo);
		return "done";
	}
}


async function get_id_user (login){
	var sql = "SELECT `id` FROM `user` WHERE `login` LIKE ?";
	var todo = [login];
	result = await db.query(sql, todo);
	return(result[0].id);
}

exports.get_id_user = async function (login){
	var sql = "SELECT `id` FROM `user` WHERE `login` LIKE ?";
	var todo = [login];
	result = await db.query(sql, todo);
	return(result[0].id);
}




async function hellog(){
	mon_login = await get_id_user("blabli");
}


async function check_mail_function(mail, check_mail){
	if (check_mail == "empty"){
		return ("empty");
	}
	else{
		var sql = "SELECT COUNT(*) AS 'count' FROM `user` WHERE `mail` LIKE ?";
		var todo = [mail];
		result1 = await db.query(sql, todo);
		if (result1[0].count != 0){
			return ("mail_already_taken");
		}
		else{
			return ("ok");
		}
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

// var sql = "SELECT COUNT(*) AS 'count' FROM `user` WHERE `mail` LIKE ?";
// var todo = [mail];
// conn.connection.query(sql, todo, function (err, result) {
// if (err) throw err;
// sql = "SELECT COUNT(*) AS 'count' FROM `user_sub` WHERE `mail` LIKE ?";
// todo = [mail];
// conn.connection.query(sql, todo, function (err1, result1){
// if (err1) throw err1;
// if (result[0].count == 0)
// callback(0);
// else if (result1[0].count != 0)
// callback(2);
// else if (result[0].count == 1){
// callback('changeok');
// }
// else
// callback(1);
// });
// });





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





