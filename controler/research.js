let bdd = require('../models/research.js');
let bdd_like = require('../models/like.js');
const router = require('express').Router();



router.route('/').get((req, res) => {
	itemsProcessed = 0;
	req.session.login = "bbchat";
	req.session.id = 15;

	if (req.session.search){
		console.log("on fait une recherche avec");
		console.log(req.session.search);



		//faire la  recherche avec ces critere
		// req.session.search = undefined;
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
	console.log(req.body);

	var tab = req.body.age.match(/[0-9]{2}/g);  //regular expression pour bebe chat
	age_debut = tab[0];
	age_fin = tab[1];  //regular expression
	tab = req.body.distance.match(/^[0-9]*/g);
	distance = tab[0];  //regular expression
	tab = req.body.inter.match(/^[0-9]*/g);
	interet = tab[0];  //regular expression
	tab = req.body.popularite.match(/^[0-5]/g);
	popularite = tab[0];  //regular expression

// console.log(popularite);

	req.session.search = new Object();
	req.session.search.age_debut = age_debut;
	req.session.search.age_find = age_fin;  //regular expression
	req.session.search.distance = distance;  //regular expression
	req.session.search.interet = interet;  //regular expression
	req.session.search.popularite = popularite;  //regular expression
	res.redirect('/research');

});




module.exports = router;
