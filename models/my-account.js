//**********************my-account************************************************
var conn = require('./connection_bdd.js');

exports.check_field_my_account = function (lname, fname, mail, login, passwd, verif,  callback){
	check_noempty(lname, fname, mail, login, passwd, verif, (check_lname, check_fname, check_mail, check_login, check_passwd) => {
		check_login_function(login, check_login, (check_login) => {
			check_mail_function(mail, check_mail,  (check_mail) => {
				check_passwd_function(passwd, verif, (check_passwd) => {
					callback(check_lname, check_fname, check_mail, check_login, check_passwd);
				})
			});
		});
	});
}


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
			callback("change passwd")
		}
		else {
			callback("wrong format");
		}
	}
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

exports.change_log_mail = function(oldlog, login, email, lname, fname, callback){
    console.log("oldlog = " + oldlog);
    console.log("log = " + login);
    console.log("email = " + email);
    var sql = "UPDATE `user` SET `login` = ?, `mail` = ?, `fname` = ?, `lname`= ? WHERE `login` = ?";
    var todo = [login, email, fname, lname, oldlog];
    conn.connection.query(sql, todo, (err) => {
        if (err){console.log(err);}
        else {
            console.log("USER UPDATED");
            callback();
        }
    });
}

// function check_logAccount(oldlog, login, callback){
// 	var sql = "SELECT COUNT(*) AS 'count' FROM `user` WHERE `login` IN (?, ?)";
// 	var todo = [oldlog, login];
// 	conn.connection.query(sql, todo, function (err, result) {
// 		if (err) throw err;
// 		sql = "SELECT COUNT(*) AS 'count' FROM `user_sub` WHERE `login` LIKE ?";
// 		todo = [login];
// 		conn.connection.query(sql, todo, function (err1, result1){
// 			if (err1) throw err1;
// 			if (result[0].count > 1 || result1[0].count > 1){
// 				callback('nochange');
// 			}
// 			else{
// 				callback('changeok');
// 			}
// 		});
// 	});
// }

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

exports.update_user = function (lname, fname, email, login, old_login){
    var sql = "UPDATE `user` SET `lname` = ?, `fname` = ?, `email` = ?, `login`= ? WHERE `login` = ?";
	var todo = [lname, fname, email, login, old_login];
	conn.connection.query(sql, todo, function (err, result) {
		if (err) throw err;
	});
}

exports.update_user_and_passwd = function (lname, fname, email, login, passwd,  old_login){
    var sql = "UPDATE `user` SET `lname` = ?, `fname` = ?, `email` = ?, `login`= ? , `passwd`= ? WHERE `login` = ?";
	var todo = [lname, fname, email, login, passwd, old_login];
	conn.connection.query(sql, todo, function (err, result) {
		if (err) throw err;
	});
}
//**********************my-account************************************************
