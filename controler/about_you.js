let bdd_about = require('../models/about_you.js');
let bdd = require('../models/bdd_functions.js');
const router = require('express').Router();
const opencage = require('opencage-api-client');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

router.route('/').get((req, res) => {
	//is preference completed
	res.locals.preferences_completed = false;
	//is localisation completed
	res.locals.localisation_completed = false;
	//is photo completed
	res.locals.photos_completed = false;
	//*************************************************************************
	res.locals.title = "About You";
	bdd_about.get_info_user(req.session.login, (result) => {
		if (result != undefined) {
			res.locals.infos = result[0];
		}
		if (res.locals.infos != undefined && res.locals.infos.interests != null){
			res.locals.infos.interArray = res.locals.infos.interests.split(",");
			if (res.locals.infos.gender != null && res.locals.infos.orientation != null && res.locals.infos.bio != null){
				res.locals.preferences_completed = true;
			}
		}
		bdd.get_id_user(req.session.login,  (id_user) => {
			bdd_about.getPic(id_user, (result) => {
				// console.log(result);
				if (result != false){
					res.locals.pic = result;
				}
				// console.log(res.locals.pic);
				//*************************************************************
				// console.log("ON GENERE ");
				// console.log(req.session)
				//*************************************************************
				bdd_about.count_photo(id_user, (count) => {
					if (count > 0){ res.locals.photos_completed = true; }
					console.log(res.locals);
					res.render('about-you.ejs', {session: req.session});
				})
			})
		});
	})
	//*************************************************************************
});

router.route('/').post((req, res) => {
	//*************************************************************************
	localisation = {};
	localisation['country'] = req.body.country;
	localisation['city' ] = req.body.city;
	localisation['zipcode'] = req.body.zipcode;

	req.session.try_locali = 0;
	req.session.localisation = localisation;

	console.log("ON GENERE LA PAGE");
	//*************************************************************************
	gender = req.body.gender;
	orientation = req.body.orientation;
	bio = req.body.bio;
	interests = req.body.interests;
	bdd.get_id_user(req.session.login,  (id_user) => {
		id_user = id_user;
		// console.log("id_user");
		console.log(id_user);
		bdd_about.is_info_user_exist(req.session.login, (userExist) => {
			if (userExist){
				bdd_about.update_info_user(id_user, gender, orientation, bio, interests);
				addPicture(id_user, req, rootPath);
			} else {
				bdd_about.insert_info_user(id_user, gender, orientation, bio, interests)
				addPicture(id_user, req, rootPath);
			}
			//*****************************************************************
			localisation = {};
			localisation['country'] = req.body.country;
			localisation['city' ] = req.body.city;
			localisation['zipcode'] = req.body.zipcode;

			req.session.try_locali = 0;
			// req.session.localisation = localisation;

			console.log("ON GENERE LA PAGE");
			if (req.body.latitude && req.body.latitude != "latitude" && req.body.latitude != "cherche_ip"){
				console.log(req.body.latitude);
				console.log(req.body.longitude);

				local = req.body.latitude + ", " + req.body.longitude;
				//on demande a l'API de trouver la ville
				opencage.geocode({q: local, language: 'fr'}).then(data => {
					// console.log(JSON.stringify(data));
					if (data.status.code == 200) {
						if (data.results.length > 0) {
							var place = data.results[0];
							// console.log(place.formatted);
							// console.log(place.components.road);
							// console.log(place.annotations.timezone.name);
							localisation['country'] = place.components.country;
							localisation['city' ] = place.components.city;
							localisation['zipcode'] = place.components.postcode;
							localisation['latitude'] = req.body.latitude;
							localisation['longitude'] = req.body.longitude;
							console.log("country=> " + place.components.country);
							console.log("city=> " + place.components.city);
							console.log("zip code=> " + place.components.postcode);
							console.log("latitude=> " + req.body.latitude);
							console.log("longitude=> " + req.body.longitude);
							//on enregistre dans la base de donne
							bdd_about.insert_info_user_localalisation(id_user, localisation['country'], localisation['city'], localisation['zipcode'], localisation['longitude'], localisation['latitude'], () => {
								// req.session.localisation = localisation;
								res.redirect('/about-you');
							})
						}
					} else if (data.status.code == 402) {
						console.log('hit free-trial daily limit');
						console.log('become a customer: https://opencagedata.com/pricing');
						res.redirect('/about_you');
					} else {
						// other possible response codes:
						// https://opencagedata.com/api#codes
						console.log('error', data.status.message);
						res.redirect('/about-you');
					}
				}).catch(error => {
					console.log('error', error.message);
					res.redirect('/about-you');
				});

			} else if (req.body.submit_button == "Localise Me") {
				console.log("SUBMIT LOCALISE ME");
				//on lui envoi une demande de localisation
				req.session.try_locali = 1;
				res.redirect('/about-you');
			} else if (localisation['country'] != "" &&
				localisation['city'] != "" &&
				localisation['zipcode'] != ""){
				loc = localisation['country'] + "  " + localisation['city'] + "  " + localisation['zipcode'];
				opencage.geocode({q: '' + loc}).then(data => {
					// console.log(JSON.stringify(data));
					if (data.status.code == 200) {
						if (data.results.length > 0) {
							var place = data.results[0];
							console.log(place);
							// console.log(place.formatted);
							// console.log(place.geometry);
							// console.log(place.annotations.timezone.name);
							console.log("country=> " + place.components.country);
							console.log("city=> " + place.components.city);
							console.log("zip code=> " + place.components.postcode);
							console.log(place.geometry.lat);
							console.log(place.geometry.lng);
							//save id bdd  place.components.country
							//save id bdd  place.components.city
							//save id bdd  place.components.postcode
							localisation['country'] = place.components.country;
							localisation['city' ] = place.components.city;
							localisation['zipcode'] = place.components.postcode;
							localisation['latitude'] = place.geometry.lat;
							localisation['longitude'] = place.geometry.lng;
							bdd_about.insert_info_user_localalisation(id_user, localisation['country'], localisation['city'], localisation['zipcode'], localisation['longitude'], localisation['latitude'], () => {
								// req.session.localisation = localisation;
								res.redirect('/about-you');
							})
						}
					} else if (data.status.code == 402) {
						console.log('hit free-trial daily limit');
						console.log('become a customer: https://opencagedata.com/pricing');
						//*********
						// Erreur a traiter
						//*********
					} else {
						// other possible response codes:
						// https://opencagedata.com/api#codes
						console.log('error', data.status.message);
						//*********
						// Erreur a traiter
						//*********
					}
				}).catch(error => {
					console.log('error', error.message);
					//*********
					// Erreur a traiter
					//*********
				});
				//on demande a 'API
			} else if(req.body.latitude && req.body.latitude == "cherche_ip") {
				console.log("on cherche avec l'ip");
				console.log("ip ==>")
				console.log(req.ipInfo);
 				var ip = req.clientIp;
 				console.log(ip);
ip = "62.210.34.185";

				var endpoint = 'http://ip-api.com/json/'+ip+'?fields=status,message,country,city,zip,lat,lon,query';

				var xhr = new XMLHttpRequest();
				xhr.open('GET', endpoint, true);
				xhr.send();

				xhr.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						var response = JSON.parse(this.responseText);
						if(response.status !== 'success') {
							console.log('query failed: ' + response.message);
							return
						}
						else {
							console.log(response);
							localisation = {};
							localisation['country'] = response.country;
							localisation['city' ] = response.city;
							localisation['zipcode'] = response.zip;
							localisation['latitude'] = response.lat;
							localisation['longitude'] = response.lon;

							bdd_about.insert_info_user_localalisation(id_user, localisation['country'], localisation['city'], localisation['zipcode'], localisation['longitude'], localisation['latitude'], () => {
								// req.session.localisation = localisation;
								res.redirect('/about-you');
							})
						}
						// Redirect
					}
				};
			}else{
				//on met une erreur
				res.redirect('/about-you');
			}
		})
	});
});














function addPicture(id_user, req, rootPath){
	//on regarde combien de photo il a
	//si inferieur a 5 on add la photo
	// console.log("on try la photo");
	// console.log(req.files);
	if (req.files != undefined && req.files.photo && req.files.photo.size != 0){
		if (req.files.photo.mimetype != "image/jpeg"){
			//utiliser mon middle ware flash
			// console.log("le format est pas bon")
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
module.exports = router;
