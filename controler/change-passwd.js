let bdd = require('../models/bdd_functions.js');

module.exports.ctrl_changePassGet = function changePassGet(req, res){
    bdd.IsLoginNumMatch(req.params.login, req.params.num, "user", (suspense) => {
        if (suspense){
            res.locals.title = "Change Password";
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
    var npass = req.session.npass;
    var verif = req.session.verif;
    bdd.IsFieldEmpty(npass, (answer) => {
        if (answer){
            bdd.IsFieldEmpty(verif, (answer1) => {
                if (answer1){
                    bdd.IsNewVerifMatch(npass, verif, (result) => {
                        if (result){
                            bdd.changePass(login, npass);
                        }
                        else{
                            res.redirect('/change-passwd/'+ req.params.login + '/' + req.params.num);
                        }
                    });
                }
                else{
                    res.redirect('/change-passwd/'+ req.params.login + '/' + req.params.num);
                }
            });
        }
        else{
            res.redirect('/change-passwd/'+ req.params.login + '/' + req.params.num);
        }
    });
}