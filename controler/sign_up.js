let bdd = require('../models/account.js');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const saltRounds = 2;

router.route('/').get((req, res) => {
	res.locals.title = "Sign Up";
	res.render('sign-up.ejs', {session: req.session});
});

router.route('/').post((req, res) => {
	var lname = req.body.lname;
	var fname = req.body.fname;
	var email = req.body.email;
	var login = req.body.login;
	var passwd = req.body.passwd;
	var verif = req.body.verif;
	bdd.check_field_sign_up(lname, fname, email, login, passwd, verif, (check_lname, check_fname, check_email, check_login, check_passwd) => {
		if (check_lname != "ok" || check_fname != "ok" || check_email != "ok" || check_login != "ok" || check_passwd != "ok"){
			req.session.ans['check_lname'] = check_lname;
			req.session.ans['check_fname'] = check_fname;
			req.session.ans['check_email'] = check_email;
			req.session.ans['check_login'] = check_login;
			req.session.ans['check_passwd'] = check_passwd;
			req.session.ans['lname'] = lname;
			req.session.ans['fname'] = fname;
			req.session.ans['email'] = email;
			req.session.ans['login'] = login;
			res.redirect('/sign-up');
		}
		else{
			bcrypt.genSalt(saltRounds, function(err, salt) {
				bcrypt.hash(passwd, salt, function(err, hash) {
					bdd.insert_user(login, hash, fname, lname, email);
					req.session.ans['notification_general'] = "Please confirm your account on your email"
					res.redirect('/sign-up');
				});
			});
		}
	});
});

module.exports = router;
