let bdd = require('../models/account.js');
const router = require('express').Router();

router.route('/').get((req, res) => {
	try {
		res.locals.title = "Sign In";
		res.render('main_view/sign-in.ejs');
	}
	catch (err){
		console.error(err);
		res.render('main_view/error.ejs');
	}
});

router.route('/').post( async (req, res) => {
	try {
		var field = {};
		var check_field = {};

		field['login'] = req.body.login;
		field['passwd'] = req.body.passwd;
		check_field['login'] = await bdd.checkLoginSignIn(field['login']);
		if (check_field['login'] == "ok"){
			check_field['passwd'] = await bdd.isLoginPasswdMatch(field['login'], field['passwd']);
		}

		if (check_field['login'] != "ok"){
			req.session.field = field;
			req.session.check_field = check_field;
			res .redirect('/sign-in');
		}
		else if (check_field['passwd'] != "match"){
			req.session.field = field;
			req.session.check_field = check_field;
			res.redirect('/sign-in');
		}
		else{
			var done = await bdd.connect_user(field['login'], req);
			req.session.ans['notification_general'] = "Successfully login"
			res.redirect('/about-you');
		}
	}
	catch (err){
		console.error(err);
		res.render('main_view/error.ejs');
	}
});

module.exports = router;
