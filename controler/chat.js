"use strict";
var bdd = require('../models/account.js');
var bdd_message = require('../models/Message.js');
var bdd_notif = require('../models/notifications.js');
const router = require('express').Router();

router.route('/:login').get(async (req, res) => {
	try {

		//verifier que le login exist
		//et pas bloqier?

		res.locals.title = "Chat";
		res.locals.my_login = req.session.login;
		res.locals.the_login_i_chat = req.params.login;
		var author = req.session.login;
		var le_recever = req.params.login;
		var id_author = await bdd.get_id_user(author);
		var id_recever = await bdd.get_id_user(le_recever);
		var messages = await bdd_message.get_message(id_author, id_recever);
		var itemsProcessed = 0;
		if (messages[0] == undefined){
			res.locals.messages = undefined;
    		res.render('main_view/chat');
		}else {
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
    				res.render('main_view/chat');
    			}
			});
		}
	}
	catch (err){
		console.log(err);
		res.redirect('/error');
	}
});

router.route('/:login').post(async (req, res) => {
	try {
		var author = req.session.login;
		var le_recever = req.params.login;
		var login = le_recever;
		var id_author = await bdd.get_id_user(author);
		var id_recever = await bdd.get_id_user(le_recever);
		//le messages message_content
		var message_content = req.body.message_hello;
		var date = new Date();
		//l'envoyer dans la base de donne
		//regarder si ils ont match
		bdd_message.save_message(id_author, id_recever, message_content, date);
		var done = await bdd_notif.save_notif(author, le_recever, message_content);
		//regarder si il est connecter
		// connecter on envoi le message dans notification avec mention lu
		//else
		//pas conencter on envvoi le message dans notification avec mention non lu
		res.redirect('/chat/'+login+'');
	}
	catch (err){
		console.log(err);
		res.redirect('/error');
	}
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
