var express = require('express');
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.urlencoded({ extended: true}));

var log;
var fname;

app.get('/', function(req, res){
	res.setHeader('Content-Type', 'text/plain');
	res.send('Vous etes a l\'accueil');
});

app.get('/sign-up', function(req, res){
    res.render('sign-up.ejs');
});

app.post('/sign-up', function(req, res){
    var lname = req.body.lastname;
    fname = req.body.firstname;
    var email = req.body.email;
    log = req.body.login;
    var passwd = req.body.passwd;
});

app.get('/sign-in', function(req, res){
    res.render('sign-in.ejs');
});

app.post('/sign-in', function(req, res){
    console.log("login=" + req.body.login);
    console.log("passwd=" + req.body.passwd);
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
