

module.exports = function(){
	return function(req, res, next) {
		console.log(req.url);
		if (req.session && req.session.ans){
			res.locals.ans = req.session.ans;
			req.session.ans = undefined;
			req.session.ans = {};
		}
		else{
			res.locals.ans = {};
			req.session.ans = {};
		}

		if (req.session && req.session.field){
			res.locals.field = req.session.field;
			req.session.field = undefined;
			req.session.field = {};
		}
		else {
			res.locals.field = {};
			req.session.field = {};
		}


		if (req.session && req.session.check_field){
			res.locals.check_field = req.session.check_field;
			req.session.check_field = undefined;
			req.session.check_field = {};
		}
		else {
			res.locals.check_field = {};
			req.session.check_field = {};
		}



		if (req.session && req.session.token){
			res.locals.token = req.session.token;
		}




		if (req.session && req.session.first_log == true){
			req.session.first_log = false;
			res.locals.first_log = true;
		}
		else{
			res.locals.first_log = false;
		}


		if (req.session && req.session.login && req.session.logon == true){
			res.locals.login = req.session.login;
			res.locals.logon = true;
		}


		if (req.session.complete_message == true){
			req.session.complete_message = false;
			res.locals.complete_message = true;
		}


		res.locals.jwtToken = req.session.jwtToken;
		req.session.jwtToken = undefined;
		next();
	}
}

