const bcrypt = require('bcrypt');
var mailer = require("nodemailer");
var emoji = require('node-emoji');
const jwt = require('jsonwebtoken');

module.exports.checkLoginSignIn = checkLoginSignIn;
module.exports.isLoginPasswdMatch = isLoginPasswdMatch;
module.exports.connect_user = connect_user;
module.exports.IsFieldOk = IsFieldOk;
module.exports.changePass = changePass;
module.exports.recover_user_data = recover_user_data;
module.exports.valide_user = valide_user;
module.exports.insert_user = insert_user;
module.exports.check_field_sign_up = check_field_sign_up;
module.exports.recover_user_ = recover_user_;
module.exports.check_field_my_account = check_field_my_account;
module.exports.send_passwd = send_passwd;
module.exports.update_user = update_user;
module.exports.IsLoginNumMatch = IsLoginNumMatch;
module.exports.get_id_user = get_id_user;
module.exports.update_user_and_passwd = update_user_and_passwd;
module.exports.isMatch = isMatch;
module.exports.valide_user_fake = valide_user_fake;

async function isMatch(userLog, ismatchLog){
	try {
		var userId = userLog;
		var ismatchId = ismatchLog;
		var sql = "SELECT * FROM `like_table` INNER JOIN `user` ON `docker`.`user`.`id` = `docker`.`like_table`.`id_user` INNER JOIN `photo` ON `docker`.`photo`.`id_user` = `docker`.`like_table`.`id_user` WHERE `id_i_like` = ? AND `like_table`.`id_user` IN (SELECT `id_i_like` FROM `like_table` WHERE `id_user` = ?)";
		var todo = [userId, userId];
		var result = await db.query(sql, todo);
		var find = result.find(element => element.id_user == ismatchId);
		if (find == undefined){
			return (false);
		}
		else{
			return (true);
		}
	}
	catch (err){
		return (err);
	}
}

async function update_user_and_passwd (field,  passwd, old_login){
	try {
		var lname = field['lname'];
		var fname = field['fname'];
		var mail = field['mail'];
		var login = field['login'];
		var sql = "UPDATE `user` SET `lname` = ?, `fname` = ?, `mail` = ?, `login`= ? , `passwd`= ? WHERE `login` = ?";
		var todo = [lname, fname, mail, login, passwd, old_login];
		var result = await db.query(sql, todo);
	}
	catch (err){
		return (err);
	}
}

async function changePass(login, passwd){
	try {
		var sql = "UPDATE `user` SET `passwd`= ? WHERE `login` = ?";
		var todo = [passwd, login];
		var result = await db.query(sql, todo);
	}
	catch (err){
		return (err);
	}
}

async function checkLoginSignIn (login){
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
		return (err);
	}
}

async function isLoginPasswdMatch (login, passwd){
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

async function connect_user(login, req){
	try {
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
	catch (err){
		return err;
	}
}

async  function check_field_sign_up (field){
	try{
		check_field = check_noempty(field);
		check_field['login'] = await check_login_function(field['login'], check_field['login']);
		check_field['mail'] = await check_mail(field['mail'], check_field['mail']);
		check_field['passwd'] = check_passwd_sign_up(field['passwd'], field['verif']);
		return (check_field);
	}catch (err){
		return err;
	}
}

async function insert_user(field, passwd){
	try{
		var num = getRandomInt(10000);
		var sql = "INSERT INTO `user_sub` (login, passwd, lname, fname, mail, num) VALUES (?, ?, ?, ?, ?, "+ num +")";
		var todo = [field['login'], passwd, field['lname'], field['fname'], field['mail'], num];
		result = await db.query(sql, todo);
		sendmail(field['mail'], "Subscription", "Click <a href=\"http://localhost:8080/confirm/"+ field['login'] + '/' + num + "\">here</a> to confirm your account.");
		return "done";
	}catch (err){
		return err;
	}
}

async function recover_user_ (login){
	try{
		var sql = "SELECT * FROM `user`  WHERE `login` LIKE ?";
		var todo = [login];
		results = await db.query(sql, todo);
		return (results[0]);
	}
	catch (err){
		return (err);
	}
}

async function check_field_my_account (old_login, old_mail, field){
	try{
		check_field = check_noempty(field);
		check_field['login'] = await check_login_function_my_account(old_login, field['login'], check_field['login']);
		check_field['mail'] = await check_mail_function(old_mail, field['mail'], check_field['mail']);
		check_field['passwd'] = check_passwd_function(field['npasswd'], field['verif']);
		console.log(check_field);
		return (check_field);
	}
	catch (err){
		return (err);
	}
}

async function update_user(lname, fname, mail, login, old_login){
	try{
		var sql = "UPDATE `user` SET `lname` = ?, `fname` = ?, `mail` = ?, `login`= ? WHERE `login` = ?";
		var todo = [lname, fname, mail, login, old_login];
		result = await db.query(sql, todo);
		return "done";
	}
	catch (err){
		return (err);
	}
}

async function send_passwd(mail){
	try{
		var answer = await check_mail_forgot(mail);
		if (answer == "ok"){
			var user = await recoveruser_wmail(mail);
			var login = user.login;
			var num = getRandomInt(10000);
			var sql = "UPDATE `user` SET `num` = ? WHERE `login` LIKE ?";
			var todo = [num, login];
			var res = await db.query(sql, todo);
			sendmail(mail, "Forgotten password", "Click <a href=\"http://localhost:8080/change-passwd/"+ login + '/' + num + "\">here</a> to change your password.");
			return (answer);
		}
		else{
			return (answer);
		}
	}
	catch (err){
		return (err);
	}
}

async function IsLoginNumMatch (login, num, cat){
	try{
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
	catch (err){
		return (err);
	}
}

function IsFieldOk(npass, verif){
	try {
		var check_passwd = check_passwd_sign_up(npass, verif);
		return (check_passwd);
	}
	catch (err){
		return (err);
	}
}

async function recover_user_data (num, callback){
	try{
		var sql = "SELECT * FROM `user_sub` WHERE `num` LIKE ?";
		var todo = [num];
		res = await db.query(sql, todo);
		return (res[0]);
	}
	catch (err){
		return (err);
	}
}

async function valide_user(login, passwd, lname, fname, mail, num){
	try{
		var sql = "INSERT INTO `user` (login, passwd, fname, lname, mail) VALUES (?, ?, ?, ?, ?)";
		var todo = [login, passwd, fname, lname, mail];
		res = await db.query(sql, todo);
		sql = "DELETE FROM `user_sub` WHERE `login` LIKE ?";
		todo = [login];
		res = await db.query(sql, todo);
		return("");
	}
	catch (err){
		return (err);
	}
}

function check_passwd_function(passwd, verif){
	try{
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
	catch (err){
		return (err);
	}
}

async function check_login_function_my_account(old_login, login, check_login){
	try{
		if (check_login == "empty"){
			return ("empty")
		}
		else{
			var sql = "SELECT COUNT(*) AS 'count' FROM `user` WHERE `login` LIKE ? UNION ALL SELECT COUNT(*) FROM `user_sub` WHERE `login` LIKE ?";
			var todo = [login, login];
			var result = await db.query(sql, todo)
			if (old_login == login){
				return ("ok");
			}
			else if (result[0].count == 0 && result[1].count == 0){
				return ("ok");
			}
			else{
				return ("login_already_taken");
			}
		}
	}
	catch (err){
		return (err);
	}
}

async function check_login_function(login, check_login, callback){
	try {
		if (check_login == "empty"){
			return ("empty")
		}
		else{
			var sql = "SELECT COUNT(*) AS 'count' FROM `user` WHERE `login` LIKE ? UNION ALL SELECT COUNT(*) FROM `user_sub` WHERE `login` LIKE ?";
			var todo = [login, login];
			var result = await db.query(sql, todo);
			console.log("RESULT LOG");
			console.log(result);
			if (result[0].count == 0 && result[1].count == 0){
				return ("ok");
			}
			else{
				return ("login_already_taken");
			}
		}
	}
	catch (err) {
		return (err);
	}
}

function check_passwd_sign_up(passwd, verif){
	try {
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
	catch (err) {
		return (err);
	}
}

function help_noempty(champs){
	try {
		if (champs == undefined || champs == "" || champs.indexOf(" ") > -1)
			return false;
		return true;
	}
	catch (err) {
		return (err);
	}
}

function check_noempty(field){
	try {
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
	catch (err) {
		return (err);
	}
}

function sendmail(mail, subject, text){
	try {
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
				throw err;
			}
			else
				transporter.close();
		});
	}
	catch (err) {
		return (err);
	}
}

function getRandomInt(max){
	return Math.floor(Math.random() * Math.floor(max));
}

async function recoveruser_wmail(email){
	try{
		var sql = "SELECT * FROM `user` WHERE `mail` LIKE ?";
		var todo = [email];
		results = await db.query(sql, todo);
		return (results[0]);
	}
	catch (err){
		return (err);
	}
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
	try{
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
	catch (err){
		return (err);
	}
}

async function get_id_user(login){
	try{
		var sql = "SELECT `id` FROM `user` WHERE `login` LIKE ?";
		var todo = [login];
		result = await db.query(sql, todo);
		return(result[0].id);
	}
	catch (err){
		return (err);
	}
}

async function check_mail(mail, check_mail){
	try{
		if (check_mail == "empty"){
			return ("empty");
		}
		else{
			var myRe = new RegExp('.*@.*', 'g');
			var bool = myRe.test(mail);
			if (bool == true){
				var sql = "SELECT COUNT(*) AS 'count' FROM `user` WHERE `mail` LIKE ? UNION ALL SELECT COUNT(*) FROM `user_sub` WHERE `mail` LIKE ?";
				var todo = [mail, mail];
				var result = await db.query(sql, todo);
				if (result[0].count > 0){
					return ("mail_already_taken");
				}
				else if (result[1].count > 0){
					return ("mail_confirm");
				}
				else{
					return ("ok");
				}
			}
			else{
				return("wrong_format");
			}
		}
	}
	catch (err){
		return (err);
	}
}

async function valide_user_fake (login, passwd, lname, fname, mail){
	try{
		var sql = "INSERT INTO `user` (login, passwd, fname, lname, mail) VALUES (?, ?, ?, ?, ?)";
		var todo = [login, passwd, fname, lname, mail];
		var done = await db.query(sql, todo);
		// sql = "DELETE FROM `user_sub` WHERE `login` LIKE ?";
		// todo = [login];
		// conn.connection.query(sql, todo, (err, res) => {
		// if (err) throw err;
		// console.log(login + "deleted from user_sub");
		// });
	}
	catch (err){
		return (err);
	}
}


async function check_mail_function(old_mail, mail, check_mail){
	try{
		if (check_mail == "empty"){
			return ("empty");
		}
		else{
			var myRe = new RegExp('.*@.*', 'g');
			var bool = myRe.test(mail);
			if (bool == true){
				var sql = "SELECT COUNT(*) AS 'count' FROM `user` WHERE `mail` LIKE ? UNION ALL SELECT COUNT(*) FROM `user_sub` WHERE `mail` LIKE ?";
				var todo = [mail, mail];
				var result = await db.query(sql, todo);
				if ((result[0].count > 0 && mail != old_mail) || result[1].count > 0){
					return ("mail_already_taken");
				}
				else{
					return ("ok");
				}
			}
			else{
				return("wrong_format");
			}
		}
	}
	catch (err){
		return (err);
	}
}

async function check_mail_forgot(mail){
	try{
		var sql = "SELECT COUNT(*) AS 'count' FROM `user` WHERE `mail` LIKE ? UNION ALL SELECT COUNT(*) FROM `user_sub` WHERE `mail` LIKE ?";
		var todo = [mail, mail];
		var result = await db.query(sql, todo);
		if (result[0].count > 0 && result[1].count == 0){
			return ("ok");
		}
		else if (result[1].count > 0){
			return ("mail_confirm");
		}
		else{
			return ("mail_unknown");
		}
	}
	catch (err){

	}
}

function check_passwd(passwd){
	try {
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
	catch (err){
		return (err);
	}
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



