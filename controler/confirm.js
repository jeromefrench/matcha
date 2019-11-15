let bdd = require('../models/bdd_functions.js');


module.exports.ctrl_confirmGet = function confirmGet(req, res){
    bdd.IsLoginNumMatch(req.params.login, req.params.num, "user_sub", (suspense) => {
        if (suspense){
            res.locals.title = "Welcome " + req.params.login + "!";
            bdd.recover_user_data(req.params.num, (data) => {
                bdd.valide_user(data.login, data.passwd, data.lname, data.fname, data.mail);
            });
            res.render('confirm.ejs');
        }
        else{
            res.locals.title = "Sorry :(";
            res.render('unconfirm.ejs');
        }
    });
}