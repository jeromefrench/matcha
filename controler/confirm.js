let bdd = require('../models/account.js');
const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.route('/:login/:num').get(async (req, res) => {
try{
	var login = req.params.login;
	var num = req.params.num;
	var suspense = await bdd.IsLoginNumMatch(login, num, "user_sub");
	console.log("1");
	if (suspense){
		var data = await bdd.recover_user_data(num);
	console.log("2");
		var done = bdd.valide_user(data.login, data.passwd, data.lname, data.fname, data.mail, num);
	console.log("3");
		done = await bdd.connect_user(login, req);
	console.log("4");
		req.session.ans['notification_general'] = "Your account is validated please fill your profile";
		res.redirect('/about-you');
	}
	else{
		req.session.ans['notification_general'] = "Sorry something wrong happen"
		res.redirect('/sign-in');
	}
}
catch (err){
	console.log(err);
}
});

module.exports = router;
