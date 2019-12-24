let bdd = require('../models/account.js');
const router = require('express').Router();

router.route('/').get((req, res) => {
	res.locals.title = "Sign In";
	res.render('main_view/sign-in.ejs');
});

router.route('/').post( async (req, res) => {
	console.log("hellog sign in");
try {
	var login = req.body.login;
	var passwd = req.body.passwd;
	check_login = await bdd.checkLoginSignIn(login);
	console.log("1");
	passwd_match = await bdd.isLoginPasswdMatch(login, passwd);
	console.log("2");
	req.session.ans['login'] = login;
	console.log("3");
	if (check_login != "ok"){
	console.log("4");
		req.session.ans['check_login'] = check_login;
		res.redirect('/sign-in');
	}
	else if (passwd_match != "match"){
	console.log("5");
		req.session.ans['check_passwd'] = passwd_match;
		res.redirect('/sign-in');
	}
	else{
	console.log("6");
		done = await bdd.connect_user(login, req);
		req.session.ans['notification_general'] = "Successfully login"
		res.redirect('/about-you');
	}
}
catch (err){
	console.log("une erreur");
	console.log(err);
}
});

module.exports = router;
