let bdd = require('../models/bdd_functions.js');
let bdd_re = require('../models/research.js');
let bdd_like = require('../models/like.js');
const router = require('express').Router();

router.route('/:login').get((req, res) => {
	res.locals.login_profil = req.params.login;
	res.locals.session = req.session;

	bdd_re.get_user_profile(req.params.login, (result) => {
		console.log(result[0]);
		user = result[0];
		bdd_like.doILike(req.session.login, user.login, function (result){
			user.do_i_like = result;
			bdd_like.doesItLikeMe(req.session.login, user.login, function (result){
				user.does_it_like_me = result;
				bdd_like.countLike(req.params.login, (count_like) => {
					console.log("COUNT LIKE =" + count_like);
					if (user.do_i_like && user.does_it_like_me){
						user.match = true;
					}
					else {
						user.match = false;
					}
					res.render('profile.ejs', {session: req.session, user: user});
				});
			});
		})
	})
});

module.exports = router;