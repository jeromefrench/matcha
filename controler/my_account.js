let bdd = require('../models/bdd_functions.js');
let su = require('../models/sign_up.js');
var cp = require('../models/change-passwd.js');
const bcrypt = require('bcrypt');
const router = require('express').Router();
const saltRounds = 2;

router.route('/').get((req, res) => {
	res.locals.title = "My Account";
	console.log("le login");
	console.log(req.session.login);
	bdd.recover_user_(req.session.login, (info) => {
		console.log(info);
		res.locals.login = info[0].login;
		res.locals.fname = info[0].fname;
		res.locals.lname = info[0].lname;
		res.locals.mail = info[0].mail;
		res.locals.passwd = info[0].passwd;
		res.render('my-account.ejs', { session: req.session });
	});
});

router.route('/').post((req, res) => {
	login = req.body.login;
	fname = req.body.fname;
	lname = req.body.lname;
	email = req.body.email;
	npass = req.body.npass;
	verif = req.body.verif;
	req.session.passwrong = 0;
	req.session.vpasswrong = 0;
	req.session.vwrong = 0;
	req.session.lnamewrong = 0;
	req.session.fnamewrong = 0;
	req.session.emailwrong = 0;
	req.session.loginwrong = 0;
	req.session.passwrong = 0;
	req.session.logexist = 0;
	req.session.mailexist = 0;
	su.check_fieldOk(lname, fname, email, login, npass, (i1, i2, i3, i4, i5, result1, result2) => {
		if (i1 == 1) {
			req.session.lnamewrong = 1;
		}
		if (i2 == 1) {
			req.session.fnamewrong = 1;
		}
		if (i3 == 1) {
			req.session.emailwrong = 1;
		}
		if (i4 == 1) {
			req.session.loginwrong = 1;
		}
		if (i5 == 1) {
			req.session.passwrong = 1;
		}
		if (result1 == 1) {
			req.session.logexist = 1;
		}
		if (result2 == 1) {
			req.session.mailexist = 1;
		}
		else if (result2 == 2) {
			req.session.mailexist = 2;
		}
		if (i1 == 0 && i2 == 0 && i3 == 0 && i4 == 0 && i5 == 0 && result1 == 0 && result2 == 0) {
			cp.IsFieldOk(npass, verif, (answer, answer1, checkOk, match) => {
				if (!answer || !checkOk) {
					req.session.passwrong = 1;
					req.session.passwd = undefined;
				}
				if (!answer1 || !match) {
					req.session.vwrong = 1;
					req.session.passwd = npass;
				}
				if (answer, answer1, checkOk, match) {
					bcrypt.genSalt(saltRounds, function (err, salt) {
						bcrypt.hash(npass, salt, function (err, hash) {
							cp.changePass(login, hash);
							res.redirect('/my-account');
						});
					});
				}
				else {
					res.redirect('/my-account');
				}
			});
		}
		else {
			res.redirect('/my-account');
		}
	});
});

module.exports = router;
