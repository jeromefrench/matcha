let su = require('../models/sign_up.js');
var bdd = require('../models/bdd_functions.js');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const saltRounds = 2;

router.route('/').get((req, res) => {
	res.locals.title = "Sign Up";

	if (req.session.upOk == 1){
		req.session.upOk = 0;
		res.render('signup_envoye.ejs', {session: req.session});
	}
	else{
		res.render('sign-up.ejs', {session: req.session});
	}
});

router.route('/').post((req, res) => {
	var lname = req.body.lname;
	var fname = req.body.fname;
	var email = req.body.email;
	var login = req.body.login;
	var passwd = req.body.passwd;

	su.check_field_sign_up(lname, fname, email, login, passwd, (check_lname, check_fname, check_email, check_login, check_passwd) => {

		if (check_lname != "ok" ||
			check_fname != "ok" ||
			check_email != "ok" ||
			check_login != "ok" ||
			check_passwd != "ok"){
			//il y a une erreur
			req.session.ans['check_lname'] = check_lname;
			req.session.ans['check_fname'] = check_lname;
			req.session.ans['check_lname'] = check_lname;
			req.session.ans['check_lname'] = check_lname;
			req.session.ans['check_lname'] = check_lname;
		}

			req.session.ans['login_check'] = "empty";
		if (i1 == 1){
			req.session.lnamewrong = 1;
			req.session.lname = undefined;
		}
		if (i2 == 1){
			req.session.fnamewrong = 1;
			req.session.fname = undefined;
		}
		if (i3 == 1){
			req.session.emailwrong = 1;
			req.session.email = undefined;
		}
		if (i4 == 1){
			req.session.loginwrong = 1;
			req.session.login = undefined;
		}
		if (i5 == 1){
			req.session.passwrong = 1;
		}
		if (result1 == false){
			req.session.logexist = 1;
			req.session.login = undefined;
		}
		if (result2 == 1){
			req.session.mailexist = 1;
			req.session.email = undefined;
		}
		else if (result2 == 2){
			req.session.mailexist = 2;
			req.session.login = undefined;
		}
		if (i1 == 0 && i2 == 0 && i3 == 0 && i4 == 0 && i5 == 0 && result1 == true && result2 == 0){
			bcrypt.genSalt(saltRounds, function(err, salt) {
				bcrypt.hash(passwd, salt, function(err, hash) {
					// Store hash in your password DB.
					//su.insert_user(login, passwd, fname, lname, email);
					su.insert_user(login, hash, fname, lname, email);
					req.session.upOk = 1;
					res.redirect('/sign-up');
				});
			});
		}
		else{
			res.redirect('/sign-up');
		}
	});
});

module.exports = router;
