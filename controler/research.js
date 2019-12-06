let bdd = require('../models/research.js');
let bdd_like = require('../models/like.js');
var bdd1 = require('../models/bdd_functions.js');
var bl = require('../models/block.js');
var about = require('../models/about_you.js');

var sortBy = require('array-sort-by');
var moment = require('moment');
var geodist = require('geodist');
const router = require('express').Router();



router.route('/').get((req, res) => {
	const page = parseInt(req.query.page);
	const limit = 9;

	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;

	itemsProcessed = 0;

	if (req.session.search && req.session.search.age_debut && req.session.search.age_fin && req.session.search.distance && req.session.search.interet && req.session.search.popularite){
		bdd1.recover_user(req.session.login, (user) => {
			bdd.search(user[0], req.session.search, (result) => {
				if (result[0] == undefined){
					res.render('research.ejs', {session: req.session});
				}
				else{
					console.log("result = " + result[0]);
					if (req.session.sortby == 'sortage'){
						res.locals.users = sortBy(result, item => 'desc:' + item.birthday);
					}
					else if (req.session.sortby == 'sortdist'){
						res.locals.users = sortBy(result, item => item.distance);
					}
					else if (req.session.sortby == 'sortinter'){
						res.locals.users = sortBy(result, item => 'desc:' + item.nb_com);
					}
					else if (req.session.sortby == 'sortpop'){
						res.locals.users = sortBy(result, item => 'desc:' + item.pop);
					}
					else if (req.session.sortby == 'sortmatch'){
						res.locals.users = sortBy(result, item => [item.ecart, item.distance, -item.nb_com, -item.pop]);
					}
					else{
						res.locals.users = result;
					}
					
					req.session.page = page;
					req.session.totalpage = Math.ceil((Object.keys(res.locals.users).length) / limit);
					if (endIndex < Object.keys(res.locals.users).length){
						req.session.nextpage = page + 1;
					}
					else{
						req.session.nextpage = undefined;
					}
					if (startIndex > 0){
						req.session.previous = page - 1;
					}
					else{
						req.session.previous = undefined;
					}
					res.locals.users = res.locals.users.slice(startIndex, endIndex);
					console.log("USER RESEARCH******************************");
					console.log(res.locals.users);
					res.render('research.ejs', {session: req.session});
				}
			});	
		});
	}
	else {
			bdd.get_user(req.session.login, (all_user) => {
				req.session.page = page;
				req.session.totalpage = page;
				if (all_user[0] == undefined){
					res.render('research.ejs', {session: req.session});
				}else{
					res.locals.users = all_user;
					req.session.page = page;
					req.session.totalpage = Math.ceil((Object.keys(res.locals.users).length) / limit);
					if (endIndex < Object.keys(res.locals.users).length){
						req.session.nextpage = page + 1;
					}
					else{
						req.session.nextpage = undefined;
					}
					if (startIndex > 0){
						req.session.previous = page - 1;
					}
					else{
						req.session.previous = undefined;
					}
					res.locals.users = all_user.slice(startIndex, endIndex);
					i = 0;
					console.log("&&&&&&&&&&&&&&&&&&&&&&&****************************");
					about.get_info_user(req.session.login, (info) => {
						loc = {lat: info[0].latitude, lon: info[0].longitude};
						console.log(loc);
						res.locals.users.forEach(() => {
							console.log("bladdddddddddddd((((((((((((((((((((((((((((((((((((");
							var dist_user = {lat: res.locals.users[i].latitude, lon: res.locals.users[i].longitude};
							console.log("dist user = " + dist_user);
							res.locals.users[i].distance = geodist(dist_user, loc, {unit: 'km'});
							// res.locals.users[i].distance = dist;
							birthdate = moment(res.locals.users[i].birthday);
							res.locals.users[i].age = -(birthdate.diff(moment(), 'years'));
							i++;
						});
						console.log("USER RE &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
						console.log(res.locals.users);
						res.render('research.ejs', {session: req.session});
					});
					// res.locals.users.forEach(() => {
					// 	// dist_user = {lat: res.locals.users[i].latitude, lon: res.locals.user[i].longitude};
					// 	// dist = geodist(dist_user, , {unit: 'km'});
					// 	// res.locals.users[i].distance = dist;
					// 	birthdate = moment(res.locals.users[i].birthday);
					// 	res.locals.users[i].age = -(birthdate.diff(moment(), 'years'));
					// 	i++;
					// });
					// console.log("USER RE &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
					// console.log(res.locals.users);
					// res.render('research.ejs', {session: req.session});
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
	res.redirect('/research/?page=1');
});





module.exports = router;
