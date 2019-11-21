const router = require('express').Router();
const opencage = require('opencage-api-client');

router.route('/').get((req, res) => {
	console.log("ON GENERE ");
	console.log(req.session)

	res.render('ip_location', {session: req.session})
});

router.route('/').post((req, res) => {

	localisation = {};
	localisation['country'] = req.body.country;
	localisation['city' ] = req.body.city;
	localisation['zipcode'] = req.body.zipcode;

	req.session.try_locali = 0;
	req.session.localisation = localisation;


	console.log("ON GENERE LA PAGE");


	if (req.body.latitude && req.body.latitude != "latitude"){
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
					console.log("country=> " + place.components.country);
					console.log("city=> " + place.components.city);
					console.log("zip code=> " + place.components.postcode);



					localisation['country'] = place.components.country;
					localisation['city' ] = place.components.city;
					localisation['zipcode'] = place.components.postcode;

					req.session.localisation = localisation;


	res.redirect('/ip');

    			}
  			} else if (data.status.code == 402) {
    			console.log('hit free-trial daily limit');
    			console.log('become a customer: https://opencagedata.com/pricing'); 
	res.redirect('/ip');
  			} else {
    			// other possible response codes:
    			// https://opencagedata.com/api#codes
    			console.log('error', data.status.message);
	res.redirect('/ip');
  			}
		}).catch(error => {
  			console.log('error', error.message);
	res.redirect('/ip');
		});




	} else if (req.body.hello) {
		console.log("SUBMIT LOCALISE ME");
		//on lui envoi une demande de localisation
		req.session.try_locali = 1;
	res.redirect('/ip');
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

					console.log(plave.components.geometry.lat);
					console.log(place.components.geometry.lng);


					//save id bdd  place.components.country
					//save id bdd  place.components.city
					//save id bdd  place.components.postcode


				}
			} else if (data.status.code == 402) {
				console.log('hit free-trial daily limit');
				console.log('become a customer: https://opencagedata.com/pricing');
			} else {
				// other possible response codes:
				// https://opencagedata.com/api#codes
				console.log('error', data.status.message);
			}
		}).catch(error => {
			console.log('error', error.message);
		});
		//on demande a 'API
	res.redirect('/ip');
	}else{
		//on met une erreur
	res.redirect('/ip');
	}
});

module.exports = router;
