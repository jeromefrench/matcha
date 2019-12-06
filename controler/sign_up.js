let su = require('../models/sign_up.js');
var bdd = require('../models/bdd_functions.js');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const saltRounds = 2;

router.route('/').get((req, res) => {
    res.locals.title = "Sign Up";
    if (req.session.upOk == 1){
        req.session.upOk = 0;
        res.render('signup_envoye.ejs', {session: req.session});
    }
    else{
        res.render('sign-up.ejs', {session: req.session});
    }
});

router.route('/').post((req, res) => {
    var lname = req.body.lname;
    var fname = req.body.fname;
    var email = req.body.email;
    var login = req.body.login;
    var passwd = req.body.passwd;
    req.session.lnamewrong = 0;
    req.session.fnamewrong = 0;
    req.session.emailwrong = 0;
    req.session.loginwrong = 0;
    req.session.passwrong = 0;
    req.session.logexist = 0;
    req.session.mailexist = 0;
    req.session.lname = lname;
    req.session.fname = fname;
    req.session.email = email;
    req.session.login = login;
    req.session.passwd = passwd;
    req.session.upOk = 0;
        su.check_fieldOk(lname, fname, email, login, passwd, (i1, i2, i3, i4, i5, result1, result2) => {
            if (i1 == 1){
                req.session.lnamewrong = 1;
                req.session.lname = undefined;
            }
            if (i2 == 1){
                req.session.fnamewrong = 1;
                req.session.fname = undefined;
            }
            if (i3 == 1){
                req.session.emailwrong = 1;
                req.session.email = undefined;
            }
            if (i4 == 1){
                req.session.loginwrong = 1;
                req.session.login = undefined;
            }
            if (i5 == 1){
                req.session.passwrong = 1;
                req.session.passwd = undefined;
            }
            if (result1 == 1){
                req.session.logexist = 1;
                req.session.login = undefined;
            }
            if (result2 == 1){
                req.session.mailexist = 1;
                req.session.email = undefined;
            }
            else if (result2 == 2){
                req.session.mailexist = 2;
                req.session.login = undefined;
            }
            if (i1 == 0 && i2 == 0 && i3 == 0 && i4 == 0 && i5 == 0 && result1 == 0 && result2 == 0){
				bcrypt.genSalt(saltRounds, function(err, salt) {
    				bcrypt.hash(passwd, salt, function(err, hash) {
        				// Store hash in your password DB.
                		//su.insert_user(login, passwd, fname, lname, email);
                		su.insert_user(login, hash, fname, lname, email);
                		req.session.upOk = 1;
                		res.redirect('/sign-up');
    				});
				})
            }
            else{
                res.redirect('/sign-up');
            }
        });
});

module.exports = router;
