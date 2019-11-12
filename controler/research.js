let bdd = require('../models/bdd_functions.js');


module.exports.ctrl_researchGet = function profileLoginGet(req, res){
    res.render('research.ejs', {session: req.session});
}


module.exports.ctrl_researchPost = function profileLoginPost(req, res){
}
