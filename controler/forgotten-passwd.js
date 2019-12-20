let bdd = require('../models/account.js');
const router = require('express').Router();

router.route('/').get((req, res) => {
	res.locals.title = "Forgotten Password";
	res.render('forgotten-passwd.ejs', {session: req.session});
});

router.route('/').post((req, res) => {
	var email = req.body.email;
	bdd.send_passwd(email, (result) => {
		if (result == 0){
			req.session.ans['notification_general'] = "The email adresse is wrong";
			res.redirect('/forgotten-passwd');
		}
		else if (result == 2){
			req.session.ans['notification_general'] = "You need to confirm your account first";
			res.redirect('/forgotten-passwd');
		}
		else if (result == 1){
			req.session.ans['notification_general'] = "An email with a link has been sent";
			res.redirect('/forgotten-passwd');
		}
		else{
			res.redirect('/forgotten-passwd');
		}
	});
});

module.exports = router;
