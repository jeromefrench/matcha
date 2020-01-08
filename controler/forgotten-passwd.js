let bdd = require('../models/account.js');
const router = require('express').Router();

router.route('/').get((req, res) => {
	try{
		res.locals.title = "Forgotten Password";
		res.render('main_view/forgotten-passwd.ejs');
	}
	catch (err){
		console.log(err);
		res.redirect('/error');
	}
});

router.route('/').post(async (req, res) => {
	try {
		var field = {};
		var check_field = {};
		field['mail'] = req.body.mail;
		check_field['mail'] = await bdd.send_passwd(field['mail']);

		if (check_field['mail'] == "change_ok"){
			req.session.ans['notification_general'] = "An email with a link has been sent";
			res.redirect('/forgotten-passwd');
		}
		else
		{
			req.session.ans['notification_general'] = "The email adresse is wrong";
			res.redirect('/forgotten-passwd');
		}
	}
	catch (err){
		console.log(err);
		res.redirect('/error');
	}
});

module.exports = router;
