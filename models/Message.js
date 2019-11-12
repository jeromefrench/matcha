
let bdd = require('./bdd_functions.js/index.js');


class Message {

	static create (content, callback){
		var date = new Date();
		bdd.insert_message(content, date);
		callback();
	}
}


module.exports = Message;
