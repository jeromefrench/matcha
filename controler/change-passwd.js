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
    bdd.IsFieldEmpty(req.session.npass, (answer) => {
        if (answer){
            bdd.IsFieldEmpty(req.session.verif, (answer1) => {
                if (answer1){
                    bdd.IsNewVerifMatch(npass, verif, ());
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