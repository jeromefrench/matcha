
module.exports.ctrl_signOutGet = function signOutGet(req, res){
	req.session.logon = false;
	req.session.login = undefined;
	res.redirect('/sign-in');
};

