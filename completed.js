var bdd = require('./models/about_you.js');

module.exports = function(){
	return async function (req, res, next) {
		if (req.url != "/sign-in" && req.url != "/sign-up" && req.url != "/my-account" && req.url != "/about-you" && req.url != "/" && req.url != "/sign-out" ){
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
