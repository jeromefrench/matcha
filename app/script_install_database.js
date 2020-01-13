var fs = require('fs');
const database = require('../connection_database.js');
var contents = fs.readFileSync("./app/docker.sql", 'utf8');

db = database.makeConn(config);

async function execute_query (db, sql){
	try {
		var result = await db.query(sql);
		return result;
	}
	catch (err){
		console.log("*****erreur********");
		console.log(err);
		return (err);
	}
}

async function hello(new_contents) {
	var i = 0;
	while  (i < new_contents.length - 1) {
		// Print each iteration to the console
		console.log(i);
		console.log(new_contents[i]);
		var done = await execute_query(db, new_contents[i]+";");
		i++
	}
	i++;
	if (i == new_contents.length){
		process.exitCode = 1;
		return i;
	}
}



new_contents = contents.toString();
new_contents = new_contents.split(";");
hello(new_contents);


