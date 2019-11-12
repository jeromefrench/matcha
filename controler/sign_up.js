let bdd = require('../models/bdd_functions.js');


module.exports.ctrl_signUpGet = function signUpGet(req, res){
    res.locals.title = "Sign Up";
    res.render('sign-up.ejs', {session: req.session});
}


module.exports.ctrl_signUpPost = function signUpPost(req, res){
    var lname = req.body.lastname;
    var fname = req.body.firstname;
    var email = req.body.email;
    var login = req.body.login;
    var passwd = req.body.passwd;
    bdd.insert_user(login, passwd, fname, lname, email, function (result){
        if (result == 1){
            console.log("oui oui oui");
            req.flash('error', "Login already exists, please try another one.");
            res.redirect('/sign-up');
        }
        else if (result == 2){
            console.log("mail :(");
            req.flash('error', "Mail already exists, please sign in.");
            res.redirect('/sign-up');
        }
        
        });
}
