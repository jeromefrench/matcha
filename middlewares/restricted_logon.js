
module.exports = function(){
	return function (req, res, next) {
		var myRe = new RegExp('^/confirm', 'g');
		console.log(myRe);
		console.log(req.url);
		var bool = myRe.test(req.url);
		console.log(bool);
		if (req.url != "/sign-in" && req.session.logon != true && req.url != "/sign-up" && !bool ){
			res.redirect('/sign-in');
		}else {
			next();
		}
	}
}
