const router = require('express').Router();
const opencage = require('opencage-api-client');

router.route('/').get((req, res) => {
	console.log("ici");
	console.log(req.session.localisation);
	res.render('ip_location', {session: req.session})
});

router.route('/').post((req, res) => {
	localisation = {};
	localisation['country'] = req.body.country;
	localisation['city' ] = req.body.city;
	localisation['zipcode'] = req.body.zipcode;

	if (localisation['country'] != "" &&
		localisation['city'] != "" &&
		localisation['zipcode'] != ""){

		loc = localisation['country'] + "  " + localisation['city'] + "  " + localisation['zipcode'];

opencage.geocode({q: '' + loc}).then(data => {
  // console.log(JSON.stringify(data));
  if (data.status.code == 200) {
    if (data.results.length > 0) {
      var place = data.results[0];
      	// console.log(place);
      // console.log(place.formatted);
      // console.log(place.geometry);
      // console.log(place.annotations.timezone.name);
      	console.log("country=> " + place.components.country);
      	console.log("city=> " + place.components.city);
      	console.log("zip code=> " + place.components.postcode);
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
	}else{
		//on met une erreur
	}

	req.session.localisation = localisation;
	console.log(req.session.localisation);
	res.redirect('/ip');
});

module.exports = router;
