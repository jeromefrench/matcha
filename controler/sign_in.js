let si = require('../models/sign_in.js');
var bdd = require('../models/bdd_functions.js');
var conn = require('../models/connection_bdd.js');

const router = require('express').Router();
// var bcrypt = require('bcrypt');
// var jwtUtil = require('../utils/jwt_util.js');

const jwt = require('jsonwebtoken');

router.route('/').get((req, res) => {
	req.session.lnamewrong = 0;
    req.session.fnamewrong = 0;
    req.session.emailwrong = 0;
    req.session.loginwrong = 0;
    req.session.passwrong = 0;
    req.session.mailexist = 0;
	res.locals.title = "Sign In";
	res.locals.jwtToken = req.session.jwtToken;


	



	req.session.jwtToken = undefined;
	res.render('sign-in.ejs', { session: req.session});
});

router.route('/').post((req, res) => {
	// console.log("la console" + req.body.login);
	var login = req.body.login;
	req.session.login = login;
    req.session.vpass = 0;
    req.session.logexist = 0;
	si.check_log(login, (result, result1) => {
		req.session.logexist = undefined;
		if (result == 0 && result1 == 0){
			req.session.logexist = 2;
			req.session.login = undefined;
			res.redirect('/sign-in');
		}
		else if (result1 > 0){
			req.session.logexist = 3;
			req.session.login = undefined;
			res.redirect('/sign-in');
		}
		else if (result > 0){
			si.isLoginPasswdMatch(login, req.body.passwd, function(match){
				if (match) {
					//	console.log("Password Match");
					bdd.get_id_user(login, (userId) => {
						var sql = "SELECT COUNT(*) AS 'count' FROM `notifications` WHERE `id_user_i_send` = ? AND `lu` = 0";
						var todo = [userId];
						conn.connection.query(sql, todo, (err, tab) => {
							if (err) {console.log(err);}
							if (tab[0].count == 0){
								bell = 0;
							}
							else{
							    bell = 1;
							}
							si.save_connection_log(userId);
							login = req.body.login;
							req.session.logon = true;
							req.session.login = login;
							req.session.vpass = 0;
							console.log(req.session.token);
							const user = {
								id: userId, 
								username: req.session.login,
								// email: 'brad@gmail.com'
							}
							let jwtToken = jwt.sign(user, 'secretkey');
							req.session.token = jwtToken;
							req.session.first_log = true;
							res.redirect('/about-you');
						});
					});
				}
				else {
					// console.log("Password dont Match");
					req.session.vpass = 2;
					req.session.logon = false;
					res.redirect('/sign-in');
				}
			});
		}
	})
});
module.exports = router;
