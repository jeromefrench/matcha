let bdd_about = require('../models/about_you.js');
let bdd = require('../models/bdd_functions.js');
const router = require('express').Router();
const opencage = require('opencage-api-client');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


router.route('/').get((req, res) => {
res.locals.preferences_completed = false;
	res.locals.localisation_completed = false;
	res.locals.photos_completed = false;
	//*************************************************************************
	//*************************************************************************
	res.locals.title = "About You";
	bdd_about.get_info_user(req.session.login, (result) => {
		bdd.get_id_user(req.session.login,  (id_user) => {
			processPreferences(result, res);
			bdd_about.getPic(id_user, (result) => {
				if (result != false){
					res.locals.pic = result;
				}
				bdd_about.count_photo(id_user, (count) => {
					if (count > 0){ res.locals.photos_completed = true; }

					if (res.locals.preferences_completed && res.locals.localisation_completed && res.locals.photos_completed){
						bdd_about.isCompleted(id_user);
					}
					res.render('about-you.ejs', {session: req.session});
				})
			})
		});
	})
});

router.route('/').post((req, res) => {
	req.session.try_locali = 0;
	localisation = {};
	localisation['country'] = req.body.country;
	localisation['city' ] = req.body.city;
	localisation['zipcode'] = req.body.zipcode;
	gender = req.body.gender;
	orientation = req.body.orientation;
	bio = req.body.bio;
	interests = req.body.interests;
	birthday = req.body.birthday;
	birthday = birthday.split("/");
	birthday = birthday[2]+ "-"+ birthday[0]+"-"+birthday[1];

	bdd.get_id_user(req.session.login,  (id_user) => {
		bdd_about.is_info_user_exist(req.session.login, (userExist) => {
			if (userExist){
				bdd_about.update_info_user(id_user, gender, orientation, bio, interests, birthday);
				addPicture(id_user, req, rootPath);
			} else {
				bdd_about.insert_info_user(id_user, gender, orientation, bio, interests, birthday);
				addPicture(id_user, req, rootPath);
			}
			//*****************************************************************
			//Localisation
			//*****************************************************************
			if (req.body.latitude && req.body.latitude != "latitude" && req.body.latitude != "cherche_ip"){
				searchLatitudeLongitude(req, res);
			} else if (req.body.submit_button == "Localise Me") {
				req.session.try_locali = 1;
				res.redirect('/about-you');
			} else if (localisation['country'] != "" && localisation['city'] != "" && localisation['zipcode'] != ""){
				searchAdresse(req, res);
			} else if(req.body.latitude && req.body.latitude == "cherche_ip") {
				searchIp(req, res);
			}else{
				res.redirect('/about-you');
			}
		})
	});
});





function searchIp(req, res){
	var ip = req.clientIp;
	ip = "62.210.34.185";
	var endpoint = 'http://ip-api.com/json/'+ip+'?fields=status,message,country,city,zip,lat,lon,query';
	var xhr = new XMLHttpRequest();
	xhr.open('GET', endpoint, true);
	xhr.send();
	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var response = JSON.parse(this.responseText);
			if(response.status !== 'success') {
				return
			}
			else {
				localisation = {};
				localisation['country'] = response.country;
				localisation['city' ] = response.city;
				localisation['zipcode'] = response.zip;
				localisation['latitude'] = response.lat;
				localisation['longitude'] = response.lon;
				bdd_about.insert_info_user_localalisation(req.session.login, localisation['country'], localisation['city'], localisation['zipcode'], localisation['longitude'], localisation['latitude'], () => {
					res.redirect('/about-you');
				})
			}
		}
	};

}

function searchAdresse(req, res){
	loc = localisation['country'] + "  " + localisation['city'] + "  " + localisation['zipcode'];
	opencage.geocode({q: '' + loc}).then(data => {
		if (data.status.code == 200) {
			if (data.results.length > 0) {
				var place = data.results[0];
				localisation['country'] = place.components.country;
				localisation['city' ] = place.components.city;
				localisation['zipcode'] = place.components.postcode;
				localisation['latitude'] = place.geometry.lat;
				localisation['longitude'] = place.geometry.lng;
				bdd_about.insert_info_user_localalisation(req.session.login, localisation['country'], localisation['city'], localisation['zipcode'], localisation['longitude'], localisation['latitude'], () => {
					res.redirect('/about-you');
				})
			}
		} else if (data.status.code == 402) {
		} else {
		}
	}).catch(error => {
		console.log('error', error.message);
	});
}

function searchLatitudeLongitude(req, res){
	local = req.body.latitude + ", " + req.body.longitude;
	opencage.geocode({q: local, language: 'fr'}).then(data => {
		if (data.status.code == 200) {
			if (data.results.length > 0) {
				var place = data.results[0];
				localisation['country'] = place.components.country;
				localisation['city' ] = place.components.city;
				localisation['zipcode'] = place.components.postcode;
				localisation['latitude'] = req.body.latitude;
				localisation['longitude'] = req.body.longitude;
				bdd_about.insert_info_user_localalisation(req.session.login, localisation['country'], localisation['city'], localisation['zipcode'], localisation['longitude'], localisation['latitude'], () => {
					res.redirect('/about-you');
				})
			}
		} else if (data.status.code == 402) {
			res.redirect('/about_you');
		} else {
			res.redirect('/about-you');
		}
	}).catch(error => {
		console.log('error', error.message);
		res.redirect('/about-you');
	});
}

function addPicture(id_user, req, rootPath){
	if (req.files != undefined && req.files.photo && req.files.photo.size != 0){
		if (req.files.photo.mimetype != "image/jpeg"){
		}
		else{
			bdd_about.count_photo(id_user, (number) => {
				// console.log("number");
				// console.log(number);
				if (number < 5){
					// console.log("on add la photo");
					// console.log(req.files.photo);
					// console.log(req.files.photo.mimetype);
					name = rootPath+"/public/photo/"+req.session.login+"/"+number;
					// console.log("le name");
					// console.log(name);
					req.files.photo.mv(name);
					// console.log(req.files.photo);
					//on add le nom de la photo dans la base
					profile = 0;
					if (number == 0){
						profile = 1;
						// console.log("ici");
					}
					bdd_about.savePic(id_user, "/public/photo/"+req.session.login+"/"+number, profile)
					number++;
				}
				else {
					// console.log("le nombre de photo est superieur a 5");
				}
			});
		}
	}
	else {
		// console.log("size 0");
	}
}



function processPreferences(result, res){
	if (result[0] != undefined) {
		res.locals.infos = result[0];
		console.log(res.locals.infos);
		res.locals.infos.birthday = res.locals.infos.birth;
		if (res.locals.infos.birthday != null)
		{
			res.locals.infos.birthday = res.locals.infos.birthday.replace("\\", "/");
			res.locals.infos.birthday = res.locals.infos.birthday.replace("\\", "/");
			res.locals.infos.birthday = res.locals.infos.birthday.replace("\\", "/");
			res.locals.infos.birthday  = res.locals.infos.birthday.split("/");
			res.locals.infos.birthday  = res.locals.infos.birthday[1]+ "/"+ res.locals.infos.birthday[2]+"/"+res.locals.infos.birthday[0];
		}
		if (res.locals.infos.interests != null){
			res.locals.infos.interArray = res.locals.infos.interests.split(",");
			if (res.locals.infos.gender != null &&
				res.locals.infos.orientation != null &&
				res.locals.infos.bio != null &&
				res.locals.infos.birthday != null){
				res.locals.preferences_completed = true;
			}
		}
		if (res.locals.infos.city != null && res.locals.infos.country != null && res.locals.infos.zip_code != null && res.locals.infos.longitude != null && res.locals.infos.latitude != null ){
			res.locals.localisation_completed = true;
		}
	}
}

module.exports = router;
