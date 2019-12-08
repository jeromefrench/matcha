let bdd = require('../models/bdd_functions.js');
var cp = require('../models/change-passwd.js');
var ma = require('../models/my-account.js');
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
	req.session.pwdwrong = 0;
	req.session.vpwrong = 0;
	req.session.lwrong = 0;
	req.session.fwrong = 0;
	req.session.ewrong = 0;
	req.session.lowrong = 0;
	req.session.loginexist = 0;
	req.session.mailexists = 0;
	ma.checkAccount(lname, fname, email, req.session.login, login, npass, (i1, i2, i3, i4, i5, result1, result2) => {
		if (i1 == 1) {
			req.session.lwrong = 1;
		}
		if (i2 == 1) {
			req.session.fwrong = 1;
		}
		if (i3 == 1) {
			req.session.ewrong = 1;
		}
		if (i4 == 1) {
			req.session.lowrong = 1;
		}
		if (i5 == 1) {
			req.session.pwdwrong = 1;
		}
		if (result1 == 'nochange') {
			req.session.loginexist = 1;
		}
		if (result2 == 2) {
			req.session.mailexists = 2;
		}
		if (i1 == 0 && i2 == 0 && i3 == 0 && i4 == 0 && i5 == 0 && (result1 == 'changeok' || result1 == false) && (result2 == 'changeok' || result2 == 0)) {
			cp.IsFieldOk(npass, verif, (answer, answer1, checkOk, match) => {
				ma.change_log_mail(req.session.login, login, email, lname, fname, () => {
					req.session.login = login;
					req.session.email = email;
					if (!answer || !checkOk) {
						req.session.pwdwrong = 1;
						req.session.passwd = undefined;
					}
					if (!answer1 || !match) {
						req.session.vpwrong = 1;
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
				
			});
		}
		else {
			res.redirect('/my-account');
		}
	});
});

module.exports = router;
