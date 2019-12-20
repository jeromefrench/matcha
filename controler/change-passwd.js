var bdd = require('../models/account.js');
const bcrypt = require('bcrypt');
const router = require('express').Router();
const saltRounds = 2;

router.route('/:login/:num').get((req, res) => {
	res.locals.login = req.params.login;
	res.locals.num = req.params.num;
	res.render('main_view/change-passwd.ejs', {locals: res.locals, session: req.session});
});

router.route('/:login/:num').post((req, res) => {
	var login = req.params.login;
	var num = req.params.num;
	var npass = req.body.npass;
	var verif = req.body.verif;

	bdd.IsLoginNumMatch(req.params.login, req.params.num, "user", (suspense) => {
		if (suspense == false){
			req.session.ans['notification_general'] = "The login and num dont match";
			res.redirect('/change-passwd/'+ req.params.login + '/' + req.params.num);
		}
		else{
			bdd.IsFieldOk(npass, verif, (check_passwd) => {
				if (check_passwd != "ok"){
					req.session.ans['check_passwd'] = check_passwd;
					res.redirect('/change-passwd/'+ req.params.login + '/' + req.params.num);
				}
				else{
					bcrypt.genSalt(saltRounds, function(err, salt) {
						bcrypt.hash(npass, salt, function(err, hash) {
							bdd.changePass(login, hash);
							req.session.ans['notification_general'] = "Your password has been change you can log in";
							res.redirect('/sign-in');
						});
					});
				}
			});
		}
	});
});

module.exports = router;
