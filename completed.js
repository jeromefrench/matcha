
module.exports = function(){
	return async function (req, res, next) {
		if (req.url != "/sign-in" &&
			req.url != "/sign-up" &&
			req.url != "/my-account" &&
			req.url != "/about-you" &&
			req.url != "/" &&
			req.url != "/sign-out" &&
			req.url.match(/^\/photo/)){
			result = await bdd.get_completed(req.session.login);
			console.log("RESULT");
			console.log(result);
			if (result && result['completed'] == 1){
				next();
			}else{
				req.session.complete_message = true;
				res.redirect('/about-you');
			}
		}
		else{
			next();
		}
	}
}
