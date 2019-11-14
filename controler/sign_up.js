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
    bdd.insert_user(login, passwd, fname, lname, email, function (result1, result2){
        bdd.check_noempty(lname, fname, email, login, passwd, (i1, i2, i3, i4, i5) => {
            if (i1 == 1)
                req.session.lnamewrong = 1;
            if (i2 == 1)
                req.session.fnamewrong = 1;
            if (i3 == 1)
                req.session.emailwrong = 1;
            if (i4 == 1)
                req.session.loginwrong = 1;
            if (i5 == 1)
                req.session.passwrong = 1;
            if (result1 == 1)
                req.session.logexist = 1;
            if (result2 == 1)
                req.session.mailexist = 1;
            if (result2 == 2)
                req.session.mailexist = 2;
            res.redirect('/sign-up');
        });
    });
}
