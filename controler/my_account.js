let bdd = require('../models/bdd_functions.js');
const router = require('express').Router();

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
		res.render('my-account.ejs', { session: req.session});
	});
});

router.route('/').post((req, res) => {
	login = req.body.login;
	fname = req.body.fname;
	lname = req.body.lname;
	mail = req.body.mail;
	console.log(login);
	res.redirect('/my-account');
});

module.exports = router;
