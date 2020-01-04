var bdd = require('../models/about_you.js');

module.exports = function(){
	return async function (req, res, next) {

		var myRe = new RegExp('^/confirm', 'g');
		var bool = myRe.test(req.url);

		var myRee = new RegExp('^/change-passwd', 'g');
		var boolbool = myRee.test(req.url);


		if (req.url != "/sign-in" && req.url != "/sign-up" && req.url != "/my-account" && req.url != "/about-you" && req.url != "/" && req.url != "/sign-out" && !bool && !boolbool && req.url != "/forgotten-passwd" ){
			console.log("ici");
			console.log(req.session.login);
			var result = await bdd.get_completed(req.session.login);
			if (result && result['completed'] == 1){
				next();
			}else{
				req.session.complete_message = true;
				res.redirect('/about-you');
			}
		}
		else{
			console.log(req.url);
			next();
		}
	}
}
