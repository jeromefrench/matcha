let bdd = require('../models/research.js');
let bdd_like = require('../models/like.js');
var bdd1 = require('../models/bdd_functions.js');
const router = require('express').Router();



router.route('/').get((req, res) => {
	itemsProcessed = 0;
	req.session.login = "bbchat";
	req.session.id = 15;

	if (req.session.search && req.session.search.age_debut && req.session.search.age_fin){
		bdd1.recover_user(req.session.login, (user) => {
			bdd.search(user[0], req.session.search, (result) => {
				res.locals.users = result;
				res.render('research.ejs', {session: req.session});
			});	
		});
	}
	else {
		bdd.get_user(req.session.login, (all_user) => {
			if (all_user[0] == undefined){
    			res.render('research.ejs', {session: req.session});
			}else{
				res.locals.users = all_user;
				console.log("hello");
				console.log(res.locals.users);
				res.render('research.ejs', {session: req.session});
    		}
		});
	}
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
	req.session.search.age_fin = age_fin;  //regular expression
	req.session.search.distance = distance;  //regular expression
	req.session.search.interet = interet;  //regular expression
	req.session.search.popularite = popularite;  //regular expression
	res.redirect('/research');

	bdd.search(req.session.search, (result) => {
		console.log(result);
	});
});




module.exports = router;
