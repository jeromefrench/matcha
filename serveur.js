let express = require('express');
let app = express();
let bodyParser = require("body-parser");
let session = require("express-session");  //pour avoir les variables de session

var socket = require('socket.io');
var port = 8080;
var server = app.listen(port);
var io = socket(server);

console.log("my socket server is running");
io.sockets.on('connection', newConnection);


var log;

function newConnection(socket){
	console.log("new connection: " + socket.id);
	socket.on('newmessage', f_new_message);
	io.sockets.on('disconnect', () =>
		{
			console.log("new disconnect: " + socket.id);
		});
}

function f_new_message(data){
	console.log("le Message: " + data);
}

let bdd = require('./models/bdd_functions.js');

//moteur de template
app.set('view engine', 'ejs'); //set le template engine pour express


//middle ware
//le middle ware s'interpose entre notre entre et notre route
app.use('/assets', express.static('public')); //defini le dossier pour les fichier static

app.use(bodyParser.urlencoded({ extended: true}));

app.use(bodyParser.json());

app.use(session({ //pour gerer les sessions
	  secret: 'sdjfkl',
	  resave: false,
	  saveUninitialized: true,
	  cookie: { secure: false }
}));

app.use(require('./middlewares/flash'));


//routes

var fs = require('fs');

// fs.readFile('./client.js','utf8', (err, data) => {
// 		console.log(data);
// });



app.get('/tchat', (req, res) => {
	// console.log("hello");
	fs.readFile('./client.js', 'utf8', (err, data) => {
		// console.log(data);
		res.send(data);
	})
});



app.get('/test', (req, res) => {
	console.log(req.session.flash);

	if (req.session.test){
		res.locals.error = req.session.test;
		req.session.test = undefined;
	}
	res.render('index', {test : 'Salut'});
});


app.post('/test', (req, res) => {
	// console.log(req.body);
	if (req.body.message == undefined || req.body.message == ""){
		req.flash('error', "Vous n'avez pas poste de message");
		req.session.test = "Il y a une erreur";
		res.redirect('/test');  // pour rediriger vers une url
		// res.render('index', {error: "Vous n'avez pas entrez de message",
		// 					test: "salut"});
	}
	else
	{
		var Message = require('./models/Message');
		Message.create(req.body.message, function (){
			req.flash('success', "Merci petit chat!");
			res.redirect('/test');  // pour rediriger vers une url
		})
	}
});


app.get('/', function(req, res){
	res.setHeader('Content-Type', 'text/plain');
	res.send('Vous etes a l\'accueil');
});

//**************SIGN UP********************************************************
var ctrl_sign_up = require('./controler/sign_up.js');
app.get('/sign-up', function(req, res){
	ctrl_sign_up.ctrl_signUpGet(req, res);
});
app.post('/sign-up', function(req, res){
	ctrl_sign_up.ctrl_signUpPost(req, res);
});
//**************SIGN IN********************************************************
var ctrl_sign_in = require('./controler/sign_in.js');
app.get('/sign-in', function(req, res){
	ctrl_sign_in.ctrl_signInGet(req, res);
});
app.post('/sign-in', (req, res) => {
	ctrl_sign_in.ctrl_signInPost(req, res);
});
//**************MY ACCOUNT*****************************************************
var ctrl_my_account = require('./controler/my_account.js');
app.get('/my-account', function(req, res){
	ctrl_my_account.ctrl_myAccountGet(req, res);
});
//**************ABOUT YOU******************************************************
var ctrl_about_you = require('./controler/about_you.js');
app.get('/about-you', function(req, res) {
	ctrl_about_you.ctrl_aboutYouGet(req, res);
});
app.post('/about-you', function(req, res) {
	ctrl_about_you.ctrl_aboutYouPost(req, res);
});





app.get('/profile/:login', function(req, res){
    res.render('profile.ejs', {login: req.params.login});
});

app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable');
});
