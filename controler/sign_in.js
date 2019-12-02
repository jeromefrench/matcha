let si = require('../models/sign_in.js');
var bdd = require('../models/bdd_functions.js');
const router = require('express').Router();
// var bcrypt = require('bcrypt');
// var jwtUtil = require('../utils/jwt_util.js');

const jwt = require('jsonwebtoken');

router.route('/').get((req, res) => {
	res.locals.title = "Sign In";
	res.locals.jwtToken = req.session.jwtToken;
	req.session.jwtToken = undefined;
	res.render('sign-in.ejs', { session: req.session});
});

router.route('/').post((req, res) => {
	// console.log("la console" + req.body.login);
	var login = req.body.login;
	req.session.login = login;
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
						si.save_connection_log(userId);
						login = req.body.login;
						req.session.logon = true;
						req.session.login = login;
						req.session.vpass = 0;
						// req.session.token = jwtUtil.generateTokenForUser(userId);
						console.log(req.session.token);
						const user = {
							id: userId, 
							username: req.session.login,
							// email: 'brad@gmail.com'
						}
						let jwtToken = jwt.sign(user, 'secretkey');
						req.session.token = jwtToken;
						res.redirect('/about-you');
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
