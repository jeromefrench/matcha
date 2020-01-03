
module.exports = function(){
	return function (req, res, next) {
console.log("333333333");
		if (req.url != "/sign-in" && req.session.logon != true && req.url != "/sign-up" ){
			res.redirect('/sign-in');
		}else {
			next();
		}
	}
console.log("4444444444");
}
