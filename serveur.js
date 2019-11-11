let express = require('express');
let app = express();
let bodyParser = require("body-parser");
let session = require("express-session");  //pour avoir les variables de session


let bdd = require('./bdd_functions.js');

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

app.get('/test', (req, res) => {
	console.log(req.session.flash);
	console.log("hello");

	if (req.session.test){
	console.log("hello2");
		res.locals.error = req.session.test;
		req.session.test = undefined;
	}
	console.log("hello3");
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

			req.flash('success', "Merci !");
			res.redirect('/test');  // pour rediriger vers une url
		})
	}
});


app.get('/', function(req, res){
	res.setHeader('Content-Type', 'text/plain');
	res.send('Vous etes a l\'accueil');
});

app.get('/sign-up', function(req, res){
    res.render('sign-up.ejs');
});

app.post('/sign-up', function(req, res){
    var lname = req.body.lastname;
    var fname = req.body.firstname;
    var email = req.body.email;
    var login = req.body.login;
    var passwd = req.body.passwd;
    bdd.insert_user(login, passwd, fname, lname, email);
});

app.get('/sign-in', function(req, res){
    res.render('sign-in.ejs');
});

app.post('/sign-in', (req, res) => {
    // console.log("login=" + req.body.login);
    // console.log("passwd=" + req.body.passwd);
    bdd.isLoginPasswdMatch(req.body.login, req.body.passwd, function(match){
    	if (match) {
            console.log("Password Match");
    	}
        else {
            console.log("Password dont Match");
        }
    });
    res.send('hello');
});

app.get('/my-account', function(req, res){
    res.render('my-account.ejs', {login: log, fname: fname});
});

app.get('/profile/:login', function(req, res){
    res.render('profile.ejs', {login: req.params.login});
});

app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable');
});
app.listen(8080);
