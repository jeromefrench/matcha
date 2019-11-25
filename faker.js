let bdd = require('./models/confirm');
let bdd_pic = require('./models/about_you');
let bdd2 = require('./models/bdd_functions.js');

// var faker = require('faker');
var cities = require("all-the-cities");
const router = require('express').Router();
var faker = require('faker/locale/fr');
var Fakerator = require('fakerator');
var fakerator = Fakerator("fr-FR");
const opencage = require('opencage-api-client');

router.route('/').get((req, res) => {
	var user = fakerator.entity.user();
	var login = user.userName;
	var mail = user.email;
	var passwd = user.password;
	var fname = user.firstName;
	var lname = user.lastName;
	console.log(user);

	bdd.valide_user_fake(login, passwd, fname, lname, mail, ()=> {
		var image = faker.internet.avatar();
	
		bdd2.get_id_user(login, (id_user) => {
			path = image;
			profile = 1;
			bdd_pic.savePic(id_user, path, profile);
	
			var gender = faker.random.arrayElement(["male","female","other"]);
			var orientation = faker.random.arrayElement(["men","women","everyone"]);
			var bio = faker.lorem.sentence();
			var interests = faker.random.arrayElement(["voyage","cuisine","escalade","equitation","soleil","sieste"]);
			var birthdate = faker.date.between('1920-01-01', '2001-01-01');
			var last_log = faker.date.between('2017-01-01', faker.date.recent());
			var city = user.address.city;
	
			bdd_pic.insert_info_user(id_user, gender, orientation, bio, interests, birthdate);
	
			loc = city + " France";
			opencage.geocode({q: '' + loc}).then(data => {
				if (data.status.code == 200) {
					if (data.results.length > 0) {
						var place = data.results[0];
						console.log(place);
						var country = place.components.country;
						var zipcode = place.components.postcode;
						var latitude = place.geometry.lat;
						var longitude = place.geometry.lng;
						bdd_pic.insert_info_user_localalisation(login, country, city, zipcode, longitude, latitude, () => {
						});
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
		});
		res.send("<p>Your on faker page");
	});
	});

module.exports = router;