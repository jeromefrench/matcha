let bdd = require('../models/bdd_functions.js');

module.exports.ctrl_changePassGet = function changePassGet(req, res){
    bdd.IsLoginNumMatch(req.params.login, req.params.num, "user", (suspense) => {
        if (suspense){
            res.locals.title = "Change Password";
            res.locals.login = req.params.login;
            res.locals.num = req.params.num;
            res.render('change-passwd.ejs', {session: req.session});
        }
        else{
            res.locals.title = "Sorry :(";
            res.render('unconfirm.ejs');
        }
    });
}

module.exports.ctrl_changePassPost = function changePassPost(req, res){
    var login = req.params.login;
    var npass = req.body.npass;
    var verif = req.body.verif;
    req.session.passwrong = 0;
    req.session.vpasswrong = 0;
    req.session.vwrong = 0;
    bdd.IsFieldEmpty(npass, (answer) => {
        if (answer){
            bdd.IsFieldEmpty(verif, (answer1) => {
                if (answer1){
                    bdd.IsNewVerifMatch(npass, verif, (result) => {
                        if (result){
                            bdd.changePass(login, npass);
                            res.redirect('/change-passwd/'+ req.params.login + '/' + req.params.num);
                        }
                        else{
                            req.session.vwrong = 1;
                            req.session.vpasswrong = 0;
                            res.redirect('/change-passwd/'+ req.params.login + '/' + req.params.num);
                        }
                    });
                }
                else{
                    req.session.vpasswrong = 1;
                    req.session.vwrong = 0;
                }
            });
        }
        else{
            req.session.passwrong = 1;
            req.session.vwrong = 0;
        }
    });
}