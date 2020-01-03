
module.exports = function(){
	return function (req, res, next) {
		if (req.url != "/sign-in" && req.session.logon != true && req.url != "/sign-up" ){
			res.redirect('/sign-in');
		}else {
			next();
		}
	}
}
