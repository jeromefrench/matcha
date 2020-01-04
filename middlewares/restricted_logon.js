
module.exports = function(){
	return function (req, res, next) {
		var myRe = new RegExp('^/confirm', 'g');
		var bool = myRe.test(req.url);



		var myRee = new RegExp('^/change-passwd', 'g');
		var boolbool = myRee.test(req.url);

		console.log(bool);
		console.log(boolbool);

		if (req.url != "/sign-in" && req.session.logon != true && req.url != "/sign-up" && !bool && !boolbool && req.url != "/forgotten-passwd"){
			res.redirect('/sign-in');
		}else {
			next();
		}
	}
}
