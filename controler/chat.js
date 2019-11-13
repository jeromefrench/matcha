var bdd = require('../models/bdd_functions.js');
var bdd_message = require('../models/message.js');

module.exports.ctrl_chatGet = function chatGet(req, res){
	res.locals.my_login = req.session.login;
	res.locals.the_login_i_chat = req.params.login;
	bdd_message.get_message(req.session.login, req.params.login, (result) => {
		console.log(result);
		res.locals.messages = result;
    	res.render('chat', { session: req.session});
	})
}



module.exports.ctrl_chatPost = function chatPost(req, res){
	author = req.session.login;
	bdd.get_id_user(author, (result) => {
		//l'autheur id_author
		id_author = result;
		le_recever = req.params.login;
		bdd.get_id_user(le_recever, (result) => {
			//le receveur id_recever
			id_recever = result;
			//le messages message_content
			message_content = req.body.message;
			date = new Date();
			//l'envoyer dans la base de donne
			bdd_message.save_message(id_author, id_recever, message_content, date);
		})
	})
	res.redirect('/chat/'+login+'');
}
