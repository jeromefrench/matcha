let bdd = require('../models/research.js');
let bdd_like = require('../models/like.js');
var bdd1 = require('../models/bdd_functions.js');
var sortBy = require('array-sort-by');
const router = require('express').Router();



router.route('/').get((req, res) => {
	const page = parseInt(req.query.page);
	const limit = parseInt(req.query.limit);

	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	itemsProcessed = 0;
	req.session.login = "bbchat";
	req.session.id = 15;

	if (req.session.search && req.session.search.age_debut && req.session.search.age_fin && req.session.search.distance && req.session.search.interet && req.session.search.popularite){
		bdd1.recover_user(req.session.login, (user) => {
			bdd.search(user[0], req.session.search, (result) => {
				console.log(result);
				if (req.session.sortby == 'sortage'){
					res.locals.users = sortBy(result, item => 'desc:' + item.birthday);
				}
				else if (req.session.sortby == 'sortdist'){
					var tmp = sortBy(result, item => item.distance);
					res.locals.users = tmp.slice(startIndex, endIndex);
				}
				else if (req.session.sortby == 'sortinter'){
					tmp = sortBy(result, item => 'desc:' + item.nb_com);
					res.locals.users = tmp.slice(startIndex, endIndex);
				}
				else if (req.session.sortby == 'sortpop'){
					tmp = sortBy(result, item => 'desc:' + item.pop);
					res.locals.users = tmp.slice(startIndex, endIndex);
				}
				else if (req.session.sortby == 'sortmatch'){
					tmp = sortBy(result, item => [item.ecart, item.distance, -item.nb_com, -item.pop]);
					res.locals.users = tmp.slice(startIndex, endIndex);
				}
				else{
					res.locals.users = result.slice(startIndex, endIndex);
				}
					req.session.page = page;
					req.session.totalpage = res.locals.users.length / limit;
					console.log(res.locals.users);
					res.render('research.ejs', {session: req.session});
			});	
		});
	}
	else {
		bdd.get_user(req.session.login, (all_user) => {
			if (all_user[0] == undefined){
    			res.render('research.ejs', {session: req.session});
			}else{
				req.session.page = page;
				req.session.totalpage = res.locals.users.length / limit;
				res.locals.users = all_user.slice(startIndex, endIndex);
				console.log("hello");
				// console.log(res.locals.users);
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
	if (req.body.sortby != undefined){
		req.session.sortby = req.body.sortby;
	}
	res.redirect('/research');
});




module.exports = router;
