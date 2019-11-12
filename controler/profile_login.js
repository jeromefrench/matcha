
let bdd = require('../models/bdd_functions.js');


module.exports.ctrl_profileLoginGet = function profileLoginGet(req, res){
    res.render('profile.ejs', {login: req.params.login});
}


module.exports.ctrl_profileLoginPost = function profileLoginPost(req, res){
}
