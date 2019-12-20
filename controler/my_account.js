let bdd = require('../models/account.js');
const bcrypt = require('bcrypt');
const router = require('express').Router();
const saltRounds = 2;

router.route('/').get((req, res) => {
	res.locals.title = "My Account";
	bdd.recover_user_(req.session.login, (info) => {
		res.locals.user = info[0];
		console.log(res.locals.user);
		res.render('main_view/my-account.ejs', { locals: res.locals, session: req.session });
	});
});

router.route('/').post((req, res) => {
	var	lname = req.body.lname;
	var	fname = req.body.fname;
	var	email = req.body.email;
	var	login = req.body.login;
	var	npass = req.body.npass;
	var	verif = req.body.verif;

	bdd.check_field_my_account(req.session.login, lname, fname, email, login, npass, verif,  (check_lname, check_fname, check_email, check_login, check_passwd) => {
		if (check_lname != "ok" || check_fname != "ok" || check_email != "ok" || check_login != "ok" || (check_passwd != "ok" && check_passwd != "wrong format")){
			req.session.ans['check_lname'] = check_lname;
			req.session.ans['check_fname'] = check_fname;
			req.session.ans['check_email'] = check_email;
			req.session.ans['check_login'] = check_login;
			req.session.ans['check_passwd'] = check_passwd;
			res.redirect('/my-account');
		}
		else if (check_passwd == "ok"){
			bdd.update_user(lname, fname, email, login, req.session.login)
			req.session.login = login;
			req.session.ans['notification_general'] = "Account information succesfully update"
			res.redirect('/my-account');
		}
		else if (check_passwd == "change passwd"){
			bcrypt.genSalt(saltRounds, function(err, salt) {
				bcrypt.hash(passwd, salt, function(err, hash) {
					update_user_and_passwd(lname, fname, email, login, hash, req.session.login)
					req.session.login = login;
					console.log("ici");
					consol.log(req.session.login);
					req.session.ans['notification_general'] = "Account information succesfully update"
					res.redirect('/sign-up');
				});
			});
		}
	});
});

module.exports = router;
