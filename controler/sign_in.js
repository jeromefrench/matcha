let si = require('../models/sign_in.js');
var bdd = require('../models/bdd_functions.js');
const router = require('express').Router();

router.route('/').get((req, res) => {
	res.locals.title = "Sign In";
	res.render('sign-in.ejs', { session: req.session});
});

router.route('/').post((req, res) => {
	console.log("la console" + req.body.login);
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
					console.log("Password Match");
					login = req.body.login;
					req.session.logon = true;
					req.session.login = login;
					req.session.vpass = 0;
				}
				else {
					console.log("Password dont Match");
					req.session.vpass = 2;
					req.session.logon = false;
				}
				res.redirect('/sign-in');
			});
		}
	})
});

module.exports = router;