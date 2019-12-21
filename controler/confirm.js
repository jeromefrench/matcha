let bdd = require('../models/account.js');
const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.route('/:login/:num').get(async (req, res) => {
	login = req.params.login;
	num = req.params.num;

	suspense = await bdd.IsLoginNumMatch(login, num, "user_sub");
	if (suspense){
		data = await bdd.recover_user_data(num);
		done = bdd.valide_user(data.login, data.passwd, data.lname, data.fname, data.mail, num);
		done = await bdd.connect_user(login, req);
		req.session.ans['notification_general'] = "Your account is validated please fill your profile";
		res.redirect('/about-you');
	}
	else{
		req.session.ans['notification_general'] = "Sorry something wrong happen"
		res.redirect('/sign-in');
	}
});

module.exports = router;
