let bdd = require('../models/bdd_functions.js');
let bdd_re = require('../models/research.js');
let bdd_like = require('../models/like.js');
var bl = require('../models/block.js');
var fk = require('../models/fake.js');
const router = require('express').Router();

router.route('/:login').get((req, res) => {
	res.locals.login_profil = req.params.login;
	res.locals.session = req.session;

	bdd_like.countVue(req.params.login, (nbVue) => {
		bdd_re.get_user_profile(req.params.login, (result) => {
			// console.log(result[0]);
			user = result[0];
			bdd_like.doILike(req.session.login, user.login, function (result){
				user.do_i_like = result;
				bdd_like.doesItLikeMe(req.session.login, user.login, function (result){
					user.does_it_like_me = result;
					bdd_like.countLike(req.params.login, (count_like) => {

						//ajouter add_visited_on_profile
						bdd_like.add_visited_profile(req.session.login, req.params.login, (callback) => {
							if (user.do_i_like && user.does_it_like_me){
								user.match = true;
							}
							else {
								user.match = false;
							}
							if (user.birthday){
								var date = new Date();
								var date1 = new Date(user.birthday);
								user.age = Math.floor((date.getTime() - date1.getTime()) / (1000*60*60*24*365));
							}
							fk.IsReport(req.session.login, req.params.login, (result) => {
								bl.IsBlocked(req.session.login, req.params.login, (block) => {
									user.block = block;
									bdd_like.addLikeVue(user.id_user, count_like, nbVue, (pop) => {
										req.session.pop = pop;
										res.render('profile.ejs', {session: req.session, user: user, report: result});									
									});
								});
							});
						});
					});
				});
			});
		});
	});
});

module.exports = router;
