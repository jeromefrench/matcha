var conn = require('./connection_bdd.js');

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

function check_logAccount(oldlog, login, callback){
	var sql = "SELECT COUNT(*) AS 'count' FROM `user` WHERE `login` IN (?, ?)";
	var todo = [oldlog, login];
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
	if (check_passwd(passwd) == false){
		i5 = 1;
	}
	callback(i1, i2, i3, i4, i5);
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

exports.checkAccount = function (lname, fname, mail, oldlog, login, passwd, callback){
	check_noempty(lname, fname, mail, login, passwd, (i1, i2, i3, i4, i5) => {
		check_logAccount(oldlog, login, (result1) => {
			check_mail(mail, (result2) => {
				callback(i1, i2, i3, i4, i5, result1, result2);
			});
		});
	});
}