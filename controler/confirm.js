let bdd = require('../models/account.js');
const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.route('/:login/:num').get(async (req, res) => {
	try{
		var login = req.params.login;
		var num = req.params.num;
		var suspense = await bdd.IsLoginNumMatch(login, num, "user_sub");
		if (suspense){
			var data = await bdd.recover_user_data(num);
			var done = bdd.valide_user(data.login, data.passwd, data.lname, data.fname, data.mail, num);
			done = await bdd.connect_user(login, req);
			req.session.ans['notification_general'] = "Your account is validated please fill your profile.";
			res.redirect('/about-you');
		}
		else{
			req.session.ans['notification_general'] = "Wrong url."
			res.redirect('/sign-in');
		}
	}
	catch (err){
		console.error(err);
		res.render('main_view/error.ejs');
	}
});

module.exports = router;
