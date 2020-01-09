let bdd = require('../models/about_you.js');
const router = require('express').Router();
const opencage = require('opencage-api-client');

router.route('/').get(async (req, res) => {
	try{
		res.locals.title = "About You";
		res.locals.ans['user'] = await bdd.get_info_user(req.session.login);

		var user = res.locals.ans['user'];

		var etiquette_preferences = false;
		if (user.gender != undefined && user.gender != false &&
			user.orientation != undefined && user.orientation != false &&
			user.bio != undefined && user.bio != false &&
			user.birthday != undefined && user.birthday != false &&
			user.interests != undefined && user.interests != false)
		{
			etiquette_preferences = true;
		}

		var etiquette_localisation = false;
		if (user.country != undefined && user.country != false &&
			user.zip_code != undefined && user.zip_code != false &&
			user.city != undefined && user.city != false &&
			user.longitude != undefined && user.longitude != false &&
			user.latitude != undefined && user.latitude != false)
		{
			etiquette_localisation = true;
		}
		var etiquette_photo = false;
		if (user.pic != undefined){
			etiquette_photo = true;
		}

		res.locals.ans['preference_completed'] = etiquette_preferences;
		res.locals.ans['localisation_completed'] = etiquette_localisation;
		res.locals.ans['pic_completed'] = etiquette_photo;

		res.render('main_view/about-you.ejs');
	}
	catch (err){
		console.error(err);
		res.render('main_view/error.ejs');
	}
});

router.route('/').post(async (req, res) => {
	try {
		var field = {};
		var check_field = {};
		var done;
		field['gender'] = req.body.gender;
		field['orientation'] = req.body.orientation;
		field['birthday'] = req.body.birthday;
		field['bio'] = req.body.bio;
		field['interests'] = req.body.interests;
		field['country'] = req.body.country;
		field['city'] = req.body.city;
		field['zip_code'] = req.body.zipcode;
		check_field = bdd.check_field_about_you(field);

		if (req.body.submit_button == "Localise Me") {
			req.session.ans['localise_me'] = true;
		}
		else{
			check_field = bdd.check_field_localisation(field, check_field)
		}

		if (check_field['localisation'] == "ok"){
			field = await searchAdresse(field);
			if (field['localisation'] == "ok"){
				check_field['longitude'] = "ok";
				check_field['latitude'] = "ok";
			}
			else{
				check_field['localisation'] = "wrong"
				check_field['country'] = "wrong";
				check_field['city'] = "wrong";
				check_field['zip_code'] = "wrong";
			}
		}
		for (const property in check_field){
			if(check_field[property] == "ok" && property != 'localisation'){
				if (property == 'birthday'){
					var birthday = field['birthday'];
			 		birthday = birthday.split("/");
			 		birthday = birthday[2]+ "-"+ birthday[0]+"-"+birthday[1];
			 		field['birthday'] = birthday;
				}
				done = await bdd.InfoUser(req.session.login, property, field[property]);
			}
		}
		var id_user = await bdd.get_id_user(req.session.login);
		var number = await bdd.count_photo(id_user);
		check_field['picture'] = bdd.check_picture(req.files, req.session.login, number);
		if (check_field['picture'] == "ok"){
			done = await bdd.savethePic(req.files, req.session.login, number);
		}
		var user = await bdd.get_info_user(req.session.login);

		var etiquette_preferences = false;
		if (user.gender != undefined && user.gender != false &&
			user.orientation != undefined && user.orientation != false &&
			user.bio != undefined && user.bio != false &&
			user.birthday != undefined && user.birthday != false &&
			user.interests != undefined && user.interests != false)
		{
			etiquette_preferences = true;
		}

		var etiquette_localisation = false;
		if (user.country != undefined && user.country != false &&
			user.zip_code != undefined && user.zip_code != false &&
			user.city != undefined && user.city != false &&
			user.longitude != undefined && user.longitude != false &&
			user.latitude != undefined && user.latitude != false)
		{
			etiquette_localisation = true;
		}
		var etiquette_photo = false;
		if (user.pic != undefined){
			etiquette_photo = true;
		}

		if (etiquette_preferences && etiquette_localisation && etiquette_photo){
			done = await bdd.isCompleted(req.session.login);
		}
		req.session.check_field = check_field;
		req.session.field = field;
		res.redirect('/about-you');
	}
	catch (err){
		console.error(err);
		res.render('main_view/error.ejs');
	}
});

async function searchAdresse(field){
	try {
		var loc = field['country'] + "  " + field['city'] + "  " + field['zip_code'];
		var data = await opencage.geocode({q: '' + loc});
		if (data.status.code == 200 && data.results.length > 0) {
			var place = data.results[0];
			field['country'] = place.components.country;
			field['city'] = place.components.city;
			field['zip_code'] = place.components.postcode;
			field['latitude'] = place.geometry.lat;
			field['longitude'] = place.geometry.lng;
			field['localisation'] = "ok";
		}
		else {
			field['localisation'] = "error";
		}
		return field;
	}
	catch (err){
		console.error(err);
		return (err);
	}
}

module.exports = router;
