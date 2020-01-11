let bdd = require('../models/account.js');
const router = require('express').Router();

router.route('/').get((req, res) => {
	try{
		res.locals.title = "Forgotten Password";
		res.render('main_view/forgotten-passwd.ejs');
	}
	catch (err){
		console.error(err);
		res.render('main_view/error.ejs');
	}
});

router.route('/').post(async (req, res) => {
	try {
		var field = {};
		var check_field = {};
		field['mail'] = req.body.mail;
		check_field['mail'] = await bdd.send_passwd(field['mail']);

		if (check_field['mail'] == "ok"){
			req.session.ans['notification_general'] = "An email with a link has been sent";
			res.redirect('/forgotten-passwd');
		}
		else
		{
			req.session.check_field = check_field;
			req.session.field = field;
			res.redirect('/forgotten-passwd');
		}
	}
	catch (err){
		console.error(err);
		res.render('main_view/error.ejs');
	}
});

module.exports = router;
