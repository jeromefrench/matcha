let bdd = require('../models/account.js');
const router = require('express').Router();

router.route('/').get((req, res) => {
	res.locals.title = "Forgotten Password";
	res.render('main_view/forgotten-passwd.ejs', {session: req.session});
});

router.route('/').post(async (req, res) => {
	var mail = req.body.mail;
	result = await bdd.send_passwd(mail);
	console.log("ici");
	console.log(result);
	if (result == 0){
		req.session.ans['notification_general'] = "The email adresse is wrong";
		res.redirect('/forgotten-passwd');
	}
	else if (result == 2){
		req.session.ans['notification_general'] = "You need to confirm your account first";
		res.redirect('/forgotten-passwd');
	}
	else if (result == "change_ok"){
		req.session.ans['notification_general'] = "An email with a link has been sent";
		res.redirect('/forgotten-passwd');
	}
	else{
		res.redirect('/forgotten-passwd');
	}
});

module.exports = router;
