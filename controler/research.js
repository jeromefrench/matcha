let bdd = require('../models/research.js');
let bdd_like = require('../models/like.js');


module.exports.ctrl_researchGet = function profileLoginGet(req, res){
	uneVariable = 3;
	itemsProcessed = 0;
	bdd.get_user(uneVariable, (all_user) => {
		all_user.forEach(function (user){
			bdd_like.doILike(req.session.login, user.login, function (result){
				user.do_i_like = result;
				bdd_like.doesItLikeMe(req.session.login, user.login, function (result){
					user.does_it_like_me = result;
					if (user.do_i_like && user.does_it_like_me){
						user.match = true;
					}
					else {
						user.match = false;
					}
					itemsProcessed++;
					if(itemsProcessed === all_user.length) {
						res.locals.users = all_user;
    					res.render('research.ejs', {session: req.session});
    				}
				});
			})
		});
	});
};