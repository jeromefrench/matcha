let bdd = require('../models/interractions.js');
const router = require('express').Router();
var bdd_notif = require('../models/notifications.js');

router.route('/:login').post(async (req, res) => {
	my_login = req.session.login;
	the_login_i_like = req.params.login;
	result = await bdd.doILike(my_login, the_login_i_like);
	if (result){
		bdd.unLike(my_login, the_login_i_like);
		// bdd_notif.save_notif(my_login, the_login_i_like, my_login + " doesn't like you anymore", (result) => {
		// });
		//res.redirect('back');
		res.send("ok");
	}
	else {
		bdd.addLike(my_login, the_login_i_like);
		// req.io.
		bdd.updateMatch(my_login, the_login_i_like);
		bdd.updateMatch(the_login_i_like, my_login);
		bdd_notif.save_notif(my_login, the_login_i_like, my_login + " likes you!", (result) => {
		});
		//res.redirect('back');
		res.send("ok");
	}
});

module.exports = router;
