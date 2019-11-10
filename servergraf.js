

let demo = require('./hello')

// demo();



function test(a, callback){
	console.log("parm"+ a);
	console.log("hello");
	b =4;
	callback(b);
}

let a = 2;
test(a, function (h){
	console.log("salut");
	console.log(h);
});
