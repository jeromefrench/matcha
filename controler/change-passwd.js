let bdd = require('../models/bdd_functions.js');
var cp = require('../models/change-passwd.js');
const router = require('express').Router();

router.route('/:login/:num').get((req, res) => {
    bdd.IsLoginNumMatch(req.params.login, req.params.num, "user", (suspense) => {
        if (req.session.changeOk == 1){
            res.render('changepassok.ejs', {session: req.session});
        }
        else{
            if (suspense){
                res.locals.title = "Change Password";
                res.locals.login = req.params.login;
                res.locals.num = req.params.num;
                res.render('change-passwd.ejs', {session: req.session});
            }
            else{
                res.locals.title = "Sorry :(";
                res.render('unconfirm.ejs', {session: req.session});
            }
        }
    });
});

router.route('/:login/:num').post((req, res) => {
    var login = req.params.login;
    var npass = req.body.npass;
    var verif = req.body.verif;
    req.session.passwrong = 0;
    req.session.vpasswrong = 0;
    req.session.vwrong = 0;
    req.session.changeOk = 0;
    cp.IsFieldOk(npass, verif, (answer, answer1, checkOk, match) => {
        if (!answer || !checkOk){
            req.session.passwrong = 1;
            req.session.passwd = undefined;
        }
        if (!answer1 || !match){
            req.session.vwrong = 1;
            req.session.passwd = npass;
        }
        if (answer, answer1, checkOk, match){
            cp.changePass(login, npass);
            req.session.changeOk = 1;
            res.redirect('/change-passwd/'+ req.params.login + '/' + req.params.num);
        }
        else{
            res.redirect('/change-passwd/'+ req.params.login + '/' + req.params.num);
        }
    });
});

module.exports = router;