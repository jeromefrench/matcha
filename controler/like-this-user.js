let bdd = require('../models/interractions.js');
const router = require('express').Router();
var bdd_notif = require('../models/notifications.js');

router.route('/:login').post(async (req, res) => {
	try {
		my_login = req.session.login;
		the_login_i_like = req.params.login;
		result = await bdd.doILike(my_login, the_login_i_like);
		if (result){
			bdd.unLike(my_login, the_login_i_like);
			bdd_notif.save_notif(my_login, the_login_i_like, my_login + " doesn't like you anymore");
			res.redirect('back');
		}
		else {
			bdd.addLike(my_login, the_login_i_like);
			bdd.updateMatch(my_login, the_login_i_like);
			bdd.updateMatch(the_login_i_like, my_login);
			bdd_notif.save_notif(my_login, the_login_i_like, my_login + " likes you!");
			res.redirect('back');
		}
	}
	catch (err){
		console.log(err);
		res.redirect('/error');
	}
});

module.exports = router;
