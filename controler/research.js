let bdd = require('../models/research.js');
var bdd1 = require('../models/interractions.js');
var about = require('../models/about_you.js');

var sortBy = require('array-sort-by');
var moment = require('moment');
var geodist = require('geodist');
const router = require('express').Router();


router.route('/').get(async (req, res) => {
	try {
		const page = parseInt(req.query.page);
		const limit = 9;

		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;

		if (req.session &&
			req.session.search &&
			req.session.search.age_debut &&
			req.session.search.age_fin &&
			req.session.search.distance &&
			req.session.search.interet &&
			req.session.search.popularite){
			var user = await bdd1.recover_user(req.session.login);
			var result= await bdd.search(user[0], req.session.search);
			if (result == undefined || result[0] == undefined){
				res.render('main_view/research.ejs', {session: req.session});
			}
			else{
				if (req.session.search.sortby == 'sortage'){
					res.locals.users = sortBy(result, item => 'desc:' + item.birthday);
				}
				else if (req.session.search.sortby == 'sortdist'){
					res.locals.users = sortBy(result, item => item.distance);
				}
				else if (req.session.search.sortby == 'sortinter'){
					res.locals.users = sortBy(result, item => 'desc:' + item.nb_com);
				}
				else if (req.session.search.sortby == 'sortpop'){
					res.locals.users = sortBy(result, item => 'desc:' + item.pop);
				}
				else if (req.session.search.sortby == 'sortmatch'){
					res.locals.users = sortBy(result, item => [item.distance, -item.nb_com, item.ecart, -item.pop]);
				}
				else{
					res.locals.users = result;
				}

				req.session.page = page;
				req.session.totalpage = Math.ceil((Object.keys(res.locals.users).length) / limit);
				if (page > req.session.totalpage || page < 1){
					req.session.page = 1;
				}
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
				res.render('main_view/research.ejs', {session: req.session});
			}
		}
		else {
			var all_user = await bdd.get_user(req.session.login);
			req.session.page = page;
			req.session.totalpage = page;
			if (all_user == undefined || all_user[0] == undefined){
				res.render('main_view/research.ejs', {session: req.session});
			}else{
				res.locals.users = all_user;
				req.session.page = page;
				req.session.totalpage = Math.ceil((Object.keys(res.locals.users).length) / limit);
				if (page > req.session.totalpage || page < 1){
					req.session.page = 1;
				}
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
				var i = 0;
				var info = await about.get_info_user(req.session.login);
				info[0] = info;
				var loc = {lat: info[0].latitude, lon: info[0].longitude};
				res.locals.users.forEach(() => {
					var dist_user = {lat: res.locals.users[i].latitude, lon: res.locals.users[i].longitude};
					res.locals.users[i].distance = geodist(dist_user, loc, {unit: 'km'});
					var birthdate = moment(res.locals.users[i].birthday);
					res.locals.users[i].age = -(birthdate.diff(moment(), 'years'));
					i++;
				});
				res.render('main_view/research.ejs', {session: req.session});
			}
		}
	}
	catch (err){
		console.error(err);
		res.render('main_view/error.ejs');
	}
});

router.route('/').post((req, res) => {
	try {
		var tab = req.body.age.match(/[0-9]{2}/g);
		var age_debut = tab[0];
		var age_fin = tab[1];
		if(age_debut < 18 || age_fin > 99){
			throw "age range not valid";
		}

		tab = req.body.distance.match(/^[0-9]*/g);
		var distance = tab[0];
		if(distance < 0 || distance > 700){
			throw "dist range not valid";
		}

		tab = req.body.inter.match(/^[0-9]*/g);
		var interet = tab[0];
		if(interet < 0 || interet > 5){
			throw "int range not valid";
		}

		tab = req.body.popularite.match(/^[0-5]/g);
		var popularite = tab[0];
		if(popularite < 0 || popularite > 5){
			throw "pop range not valid";
		}

		req.session.search = new Object();
		req.session.search.age_debut = age_debut;
		req.session.search.age_fin = age_fin;
		req.session.search.distance = distance;
		req.session.search.interet = interet;
		req.session.search.popularite = popularite;


		if (req.body.sortby != undefined){
			req.session.search.sortby = req.body.sortby;
		}
		if(req.body.sortby != undefined && req.body.sortby != "sortage" && req.body.sortby != "sortdist" && req.body.sortby != "sortinter" && req.body.sortby != "sortpop" && req.body.sortby != "sortmatch"){
			throw "sortby not valid";
		}
		res.redirect('/research/?page=1');
	}
	catch (err){
		console.error(err);
		res.render('main_view/error.ejs');
	}
});

module.exports = router;
