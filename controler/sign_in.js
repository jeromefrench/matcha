let bdd_sign_in = require('../models/sign_in.js');
var bdd = require('../models/bdd_functions.js');
var conn = require('../models/connection_bdd.js');

const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.route('/').get((req, res) => {
	res.locals.title = "Sign In";
	res.locals.jwtToken = req.session.jwtToken;
	req.session.jwtToken = undefined;
	console.log("res locals ans");
	console.log(res.locals.ans)
	res.render('sign-in.ejs', { locals: res.locals, session: req.session});
});

router.route('/').post((req, res) => {
	var login = req.body.login;
	var passwd = req.body.passwd;
	bdd_sign_in.check_login(login, (result) => {
		console.log("login result")
		console.log(result);
		if (result == "empty"){
			req.session.ans['login_check'] = "empty";
			res.redirect('/sign-in');
		}
		else if(result == "need_confirm"){
			req.session.ans['login_check'] = "need_confirm";
			res.redirect('/sign-in');
		}
		else if (result == "login_no_exist"){
			req.session.ans['login_check'] = "login_no_exist";
			console.log(req.session.ans);
			res.redirect('/sign-in');
		}
		else{
			req.session.ans['login'] = login;
			bdd_sign_in.isLoginPasswdMatch(login, passwd, function(passwd_match){
				if (passwd_match == "empty"){
					req.session.ans['pass_check'] = "empty";
					res.redirect('/sign-in');
				}
				else if (passwd_match == false){
					req.session.ans['pass_check'] = "dont_match";
					res.redirect('/sign-in');
				}
				else if (passwd_match == true){
					bdd.get_id_user(login, (userId) => {
						req.session.token = jwtToken;
						req.session.first_log = true;
						req.session.logon = true;
						req.session.login = login;
						const user = { id: userId, username: login};
						bdd_sign_in.save_connection_log(userId);
						let jwtToken = jwt.sign(user, 'secretkey');

						//**********je sais pas ce que sais*********************
						var sql = "SELECT COUNT(*) AS 'count' FROM `notifications` WHERE `id_user_i_send` = ? AND `lu` = 0";
						var todo = [userId];
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
							res.redirect('/about-you');
						});
					});
				}
			});
		}
	})
});
module.exports = router;
