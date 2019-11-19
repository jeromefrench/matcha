var bdd = require('../models/bdd_functions.js');
var bdd_message = require('../models/message.js');
const router = require('express').Router();

router.route('/:login').get((req, res) => {
	res.locals.my_login = req.session.login;
	res.locals.the_login_i_chat = req.params.login;
	author = req.session.login;
	le_recever = req.params.login;
	bdd.get_id_user(author, (result) => {
		id_author = result;
		bdd.get_id_user(le_recever, (result) => {
			id_recever = result;
			bdd_message.get_message(id_author, id_recever, (messages) => {
				itemsProcessed = 0;
				messages.forEach(function (message){
					if (message.id_author == id_author){
						message.author = author;
					}
					else {
						message.author = le_recever;
					}
					itemsProcessed++;
					if(itemsProcessed === messages.length) {
						res.locals.messages = messages;
    					res.render('chat', { session: req.session});
    				}
				});
			})
		});
	});
});

router.route('/:login').post((req, res) => {
	author = req.session.login;
	le_recever = req.params.login;
	login = le_recever;
	bdd.get_id_user(author, (result) => {
		//l'autheur id_author
		id_author = result;
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
});

module.exports = router;
// module.exports.ctrl_chatGet = function chatGet(req, res){
// 	res.locals.my_login = req.session.login;
// 	res.locals.the_login_i_chat = req.params.login;
// 	author = req.session.login;
// 	le_recever = req.params.login;
// 	bdd.get_id_user(author, (result) => {
// 		id_author = result;
// 		bdd.get_id_user(le_recever, (result) => {
// 			id_recever = result;
// 			bdd_message.get_message(id_author, id_recever, (messages) => {
// 				itemsProcessed = 0;
// 				messages.forEach(function (message){
// 					if (message.id_author == id_author){
// 						message.author = author;
// 					}
// 					else {
// 						message.author = le_recever;
// 					}
// 					itemsProcessed++;
// 					if(itemsProcessed === messages.length) {
// 						res.locals.messages = messages;
//     					res.render('chat', { session: req.session});
//     				}
// 				});
// 			})
// 		});
// 	});
// }

// module.exports.ctrl_chatPost = function chatPost(req, res){
// 	author = req.session.login;
// 	le_recever = req.params.login;
// 	login = le_recever;
// 	bdd.get_id_user(author, (result) => {
// 		//l'autheur id_author
// 		id_author = result;
// 		bdd.get_id_user(le_recever, (result) => {
// 			//le receveur id_recever
// 			id_recever = result;
// 			//le messages message_content
// 			message_content = req.body.message;
// 			date = new Date();
// 			//l'envoyer dans la base de donne
// 			bdd_message.save_message(id_author, id_recever, message_content, date);
// 		})
// 	})
// 	res.redirect('/chat/'+login+'');
// }
