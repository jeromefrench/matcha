let bdd = require('../models/about_you.js');
const router = require('express').Router();
const opencage = require('opencage-api-client');

router.route('/').get(async (req, res) => {
	res.locals.title = "About You";
	res.locals.ans['user'] = await bdd.get_info_user(res, req.session.login);
	res.render('main_view/about-you.ejs');
});

router.route('/').post(async (req, res) => {
	console.log("on est dans post");
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


	console.log("field :==>");
	console.log(field);

	if (check_field['localisation'] == "ok"){
		console.log("field :==>");
		console.log(field);
		field = await searchAdresse(field);
		console.log("field :==>");
		console.log(field);
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



	console.log("field :==>");
	console.log(field);
	console.log("check field :==>");
	console.log(check_field);
	for (const property in check_field){
		if(check_field[property] == "ok" && property != 'localisation'){
			if (property == 'birthday'){
				var birthday = field['birthday'];
			 	birthday = birthday.split("/");
			 	birthday = birthday[2]+ "-"+ birthday[0]+"-"+birthday[1];
			 	field['birthday'] = birthday;
			}
			console.log("AAAAAAAAAAAAAAAAAAAAA");
			console.log(property);
			console.log(field[property]);
			done = await bdd.InfoUser(req.session.login, property, field[property]);
		}
	}
	var id_user = await bdd.get_id_user(req.session.login);
	var number = await bdd.count_photo(id_user);
	check_field['picture'] = bdd.check_picture(req.files, req.session.login, number);
	console.log(check_field['picture']);
	console.log("hellot you");
	console.log(number);
	if (check_field['picture'] == "ok"){
		done = await bdd.savethePic(req.files, req.session.login, number);
	}
	req.session.check_field = check_field;
	req.session.field = field;
	res.redirect('/about-you');
}
catch (err){
	console.log(err);
}
});

async function searchAdresse(field){

	console.log("on cherche");
	loc = field['country'] + "  " + field['city'] + "  " + field['zip_code'];
	data = await opencage.geocode({q: '' + loc});
	if (data.status.code == 200 && data.results.length > 0) {
		var place = data.results[0];
		field['country'] = place.components.country;
		field['city' ] = place.components.city;
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

module.exports = router;
