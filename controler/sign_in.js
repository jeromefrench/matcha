let bdd = require('../models/account.js');
const router = require('express').Router();

router.route('/').get((req, res) => {
	res.locals.title = "Sign In";
	res.render('main_view/sign-in.ejs');
});

router.route('/').post( async (req, res) => {
try {
	var field = {};
	var check_field = {};

	console.log("ici");
	console.log(req.body.login);

	field['login'] = req.body.login;
	field['passwd'] = req.body.passwd;
	check_field['login'] = await bdd.checkLoginSignIn(field['login']);
	check_field['passwd'] = await bdd.isLoginPasswdMatch(field['login'], field['passwd']);

	if (check_field['login'] != "ok"){
		console.log(check_field);
		req.session.field = field;
		req.session.check_field = check_field;
		res .redirect('/sign-in');
	}
	else if (check_field['passwd'] != "match"){
		console.log(check_field);
		req.session.field = field;
		req.session.check_fikld = check_field;
		res.redirect('/sign-in');
	}
	else{
		console.log(check_field);
		console.log("on redirect");
		var done = await bdd.connect_user(field['login'], req);
		req.session.ans['notification_general'] = "Successfully login"
		console.log("session");
		console.log(req.session);
		res.redirect('/about-you');
	}
}
catch (err){
	console.log(err);
}
});

module.exports = router;
