var express = require('express');
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/', function(req, res){
	res.setHeader('Content-Type', 'text/plain');
	res.send('Vous etes a l\'accueil');
});

app.get('/login', function(req, res){
    res.render('login.ejs');
});

app.post('/login', function(req, res){
    var identifiant = req.body.identifiant;
    console.log("identifiant=" + identifiant);
});

app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable');
});
app.listen(8080);
