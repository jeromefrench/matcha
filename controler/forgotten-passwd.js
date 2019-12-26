let bdd = require('../models/account.js');
const router = require('express').Router();

router.route('/').get((req, res) => {
	res.locals.title = "Forgotten Password";
	res.render('main_view/forgotten-passwd.ejs');
});

router.route('/').post(async (req, res) => {
try {
	var field = {};
	var check_field = {};


	field['mail'] = req.body.mail;
	check_field['mail'] = await bdd.send_passwd(mail);


	if (check_field['mail'] == 0){
		req.sessions.check_field = check_field;
		req.sessions.field = field;
		//req.session.ans['notification_general'] = "The email adresse is wrong";
		res.redirect('/forgotten-passwd');
	}
	else if (check_field['mail'] == 2){
		req.sessions.check_field = check_field;
		req.sessions.field = field;
		//req.session.ans['notification_general'] = "You need to confirm your account first";
		res.redirect('/forgotten-passwd');
	}
	else if (check_field['mail'] == "change_ok"){
		req.sessions.check_field = check_field;
		req.sessions.field = field;
		//req.session.ans['notification_general'] = "An email with a link has been sent";
		res.redirect('/forgotten-passwd');
	}
	else{
		res.redirect('/forgotten-passwd');
	}
}
catch (err){
	console.log(err);
}
});

module.exports = router;
