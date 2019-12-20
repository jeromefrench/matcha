//************change-passwd****************************************************
function IsFieldEmpty(field, callback){
	if (field == undefined || field == "" || field.indexOf(" ") > -1)
		callback(false);
	callback(true);
}

 function IsNewVerifMatch(npass, verif, callback){
	if (npass == verif){
		callback(true);
	}
	else{
		callback(false);
	}
}

function check_passwd(passwd, callback){
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
		callback(false);
	}
	callback(true);
}

exports.IsFieldOk = function (npass, verif, callback){
	IsFieldEmpty(npass, (answer) => {
		IsFieldEmpty(verif, (answer1) => {
			check_passwd(npass, (checkOk) => {
				IsNewVerifMatch(npass, verif, (match) => {
					callback(answer, answer1, checkOk, match);
				});
			});
		});
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
