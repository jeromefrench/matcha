let bdd = require('../models/bdd_functions.js');


module.exports.ctrl_signUpGet = function signUpGet(req, res){
    res.locals.title = "Sign Up";
    res.render('sign-up.ejs', {session: req.session});
}


module.exports.ctrl_signUpPost = function signUpPost(req, res){
    res.locals.title = "Sign Up";
    var lname = req.body.lastname;
    var fname = req.body.firstname;
    var email = req.body.email;
    var login = req.body.login;
    var passwd = req.body.passwd;
    bdd.insert_user(login, passwd, fname, lname, email, function (result1, result2){
        console.log("r2 =" + result2);
        if (result1 == 1)
            res.locals.logerror = 1;
        if (result2 == 1)
            res.locals.mailerror = 1;
        res.render('sign-up.ejs');
        res.locals.mailerror = 0;
        res.locals.logerror = 0;
        });
}
