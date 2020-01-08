
module.exports = function(){
	return function (req, res, next) {
		var myRe = new RegExp('^/confirm', 'g');
		var bool = myRe.test(req.url);

		var myRee = new RegExp('^/change-passwd', 'g');
		var boolbool = myRee.test(req.url);


		var myReee = new RegExp('^/faker', 'g');
		var boolboolbool = myReee.test(req.url);


		if (req.url != "/sign-in" && req.session.logon != true && req.url != "/sign-up" && !bool && !boolbool && !boolboolbool && req.url != "/forgotten-passwd"){
			res.redirect('/sign-in');
		}else {
			next();
		}
	}
}
