let cf = require('../models/confirm.js');
var bdd = require('../models/bdd_functions.js');
const router = require('express').Router();

router.route('/:login/:num').get((req, res) => {
    req.session.lnamewrong = undefined;
    req.session.fnamewrong = undefined;
    req.session.emailwrong = undefined;
    req.session.loginwrong = undefined;
    req.session.passwrong = undefined;
    req.session.logexist = undefined;
    req.session.mailexist = undefined;
    bdd.IsLoginNumMatch(req.params.login, req.params.num, "user_sub", (suspense) => {
        if (suspense){
            res.locals.title = "Welcome " + req.params.login + "!";
            cf.recover_user_data(req.params.num, (data) => {
                cf.valide_user(data.login, data.passwd, data.lname, data.fname, data.mail);
            });
            res.render('confirm.ejs', {session: req.session});
        }
        else{
            res.locals.title = "Sorry :(";
            res.render('unconfirm.ejs', {session: req.session});
        }
    });
});

module.exports = router;