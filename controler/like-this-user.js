let bdd = require('../models/like.js');
const router = require('express').Router();

router.route('/:login').get((req, res) => {
	my_login = req.session.login;
	the_login_i_like = req.params.login;
	bdd.doILike(my_login, the_login_i_like, (result) => {
		if (result){
			bdd.unLike(my_login, the_login_i_like);
			res.redirect('back');
		}
		else {
			bdd.addLike(my_login, the_login_i_like);
			res.redirect('back');
		}
	});
});

module.exports = router;