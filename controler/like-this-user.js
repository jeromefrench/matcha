let bdd = require('../models/like.js');

module.exports.ctrl_like_this_userGet = function sign_in(req, res){
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
	})
}
