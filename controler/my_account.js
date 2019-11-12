let bdd = require('../models/bdd_functions.js');


module.exports.ctrl_myAccountGet = function myAccountGet(req, res){
	res.locals.title = "My Account";
	bdd.recover_user(log, (info) => {
		console.log(info);
		res.locals.login = info[0].login;
		res.locals.fname = info[0].fname;
		res.locals.lname = info[0].lname;
		res.locals.mail = info[0].mail;
		res.locals.passwd = info[0].passwd;
		res.render('my-account.ejs');
	});
}


module.exports.ctrl_myAccountPost = function myAccountPost(req, res){
}
