let bdd = require('../models/like.js');
const router = require('express').Router();
var bdd_notif = require('../models/notifications.js');

router.route('/:login').get((req, res) => {
	my_login = req.session.login;
	the_login_i_like = req.params.login;
	bdd.doILike(my_login, the_login_i_like, (result) => {
		if (result){
			bdd.unLike(my_login, the_login_i_like);
			bdd_notif.save_notif(my_login, the_login_i_like, my_login + " doesn't you anymore", (result) => {
			});
			res.redirect('back');
		}
		else {
			bdd.addLike(my_login, the_login_i_like);
			bdd_notif.save_notif(my_login, the_login_i_like, my_login + " likes you!", (result) => {
			});
			res.redirect('back');
		}
	});
});

module.exports = router;