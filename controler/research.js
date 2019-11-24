let bdd = require('../models/research.js');
let bdd_like = require('../models/like.js');
const router = require('express').Router();



router.route('/').get((req, res) => {
	itemsProcessed = 0;


	if (req.session.search){
		console.log("on fait une recherche avec");
		console.log(req.session.search);



		//faire la  recherche avec ces critere
		req.session.search = undefined;
	}



	bdd.get_user(req.session.login, (all_user) => {
		// console.log("ici");
		// console.log(all_user);
		if (all_user[0] == undefined){
    		res.render('research.ejs', {session: req.session});
		}else{
			all_user.forEach(function (user){
				// console.log("ici");
				bdd_like.doILike(req.session.login, user.login, function (result){
					// console.log("ici");
					user.do_i_like = result;
					bdd_like.doesItLikeMe(req.session.login, user.login, function (result){
						// console.log("ici");
						user.does_it_like_me = result;
						if (user.do_i_like && user.does_it_like_me){
							user.match = true;
						}
						else {
							user.match = false;
						}
						itemsProcessed++;
						// console.log(all_user.length);
						// console.log(itemsProcessed);
						if(itemsProcessed === all_user.length) {
							res.locals.users = all_user;
						// console.log("iciaaa");
							// console.log(res.locals.users);
    						res.render('research.ejs', {session: req.session});
    					}
					});
				})
			});

		}
	});
});



router.route('/').post((req, res) => {
	//console.log(req.body);


	age_debut = "";  //regular expression pour bebe chat
	age_find = "";  //regular expression
	distance = "";  //regular expression
	interet = "";  //regular expression
	popularite = "";  //regular expression


	req.session.search = new Object();
	req.session.search.age_debut = "18";
	req.session.search.age_find = "25";  //regular expression
	req.session.search.distance = "200";  //regular expression
	req.session.search.interet = "2";  //regular expression
	req.session.search.popularite = "2";  //regular expression
	res.redirect('/research');

});




module.exports = router;
