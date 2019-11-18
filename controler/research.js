let bdd = require('../models/research.js');
let bdd_like = require('../models/like.js');


module.exports.ctrl_researchGet = function profileLoginGet(req, res){
	uneVariable = 3;
	itemsProcessed = 0;
	bdd.get_user(req.session.login, (all_user) => {
		console.log("ici");
		console.log(all_user);

		if (all_user[0] == undefined){
    		res.render('research.ejs', {session: req.session});
		}else{
			all_user.forEach(function (user){
				console.log("ici");
				bdd_like.doILike(req.session.login, user.login, function (result){
					console.log("ici");
					user.do_i_like = result;
					bdd_like.doesItLikeMe(req.session.login, user.login, function (result){
						console.log("ici");
						user.does_it_like_me = result;
						if (user.do_i_like && user.does_it_like_me){
							user.match = true;
						}
						else {
							user.match = false;
						}
						itemsProcessed++;
						console.log(all_user.length);
						console.log(itemsProcessed);
						if(itemsProcessed === all_user.length) {
							res.locals.users = all_user;
						console.log("iciaaa");
							console.log(res.locals.users);
    						res.render('research.ejs', {session: req.session});
    					}
					});
				})
			});

		}


	});
};
