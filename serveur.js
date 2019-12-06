const bdd1 = require('./models/bdd_functions.js')
const express = require('express');
const fileUpload = require('express-fileupload');
let session = require("express-session");
let bodyParser = require("body-parser");
const app = express();
var server = app.listen(8080);
const io = require('socket.io')(server, {
  pingTimeout: 60000,
});
const requestIp = require('request-ip');
socketFile = require('./socket.js')(io);
//************************************
app.set('view engine', 'ejs'); //set le template engine pour express
app.set('trust proxy', true) //ip
//MIDDLE WARES*****************************************************************
app.use(function(req,res,next){ req.io = io; next(); })
app.use('/assets', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(session({ secret: 'sdjfkl', resave: false, saveUninitialized: true, cookie: { secure: false } }));
app.use(require('./middlewares/flash'));
app.use(fileUpload({ useTempFiles : true, tempFileDir : __dirname+'/public/tmp', createParentPath : true }));
app.use(requestIp.mw())
rootPath = __dirname;
const signout = require('./controler/sign_out.js');
const signup = require('./controler/sign_up.js');
const signin = require('./controler/sign_in.js');
const myaccount = require('./controler/my_account.js');
const aboutyou = require('./controler/about_you.js');
const profile = require('./controler/profile_login.js');
const like = require('./controler/like-this-user.js');
const research = require('./controler/research.js');
const confirm = require('./controler/confirm.js');
const sendpass = require('./controler/forgotten-passwd.js');
const changepass = require('./controler/change-passwd.js');
const delpic = require('./controler/delPic.js');
const makeProfilePic = require('./controler/make_profile_pic.js');
const faker = require('./faker.js');
const dashboard = require('./controler/dashboard.js');
const chat = require('./controler/chat.js');
const fake = require('./controler/fake.js');
const block = require('./controler/block.js');
const notifications = require('./controler/notifications.js');
users = [];

app.use(function (req, res, next) {
	if (req.session && req.session.token){
		res.locals.token = req.session.token;
	}
	if (req.session && req.session.first_log == true){
		req.session.first_log = false;
		res.locals.first_log = true;
	}
	else{
		res.locals.first_log = false;
	}
	if (req.session && req.session.login && req.session.logon == true){
		res.locals.log_in = req.session.login;
	}
	if (req.session.complete_message == true){
		req.session.complete_message = false;
		res.locals.complete_message = true;
	}
	req.io = io;
	next();
})
app.use('/confirm', confirm);
app.use('/forgotten-passwd', sendpass);
app.use('/faker', faker);
app.use(function (req, res, next) {
	if (req.url != "/sign-in" && req.session.logon != true && req.url != "/sign-up" ){
		res.redirect('/sign-in');
	}else {
		next();
	}
})

app.use(function (req, res, next) {
	console.log("URL");
	console.log(req.url);
	if (req.url != "/sign-in" && req.url != "/sign-up" && req.url != "/my-account" && req.url != "/about-you" && req.url != "/" && req.url != "/sign-out" ){
		bdd1.get_completed(req.session.login,  (result) => {
			console.log("RESULT");
			console.log(result);
			if (result && result['completed'] == 1){
				next();
			}else{
				req.session.complete_message = true;
				res.redirect('/about-you');
			}
		});
	}
	else {
		next();
	}
});

app.get('/', function(req, res){
	if (req.session.logon) {
		res.redirect('/about-you');
	}else{
		res.redirect('/sign-in');
	}
});
app.use('/sign-out', signout);
app.use('/sign-up', signup);
app.use('/sign-in', signin);
app.use('/my-account', myaccount);
app.use('/about-you', aboutyou);
app.use('/profile/', profile);
app.use('/like-this-user', like);
app.use('/research', research);
app.use('/change-passwd', changepass);
app.use('/public/photo', delpic);
app.use('/public/photo', makeProfilePic);
app.use('/chat', chat);
app.use('/dashboard', dashboard);
app.use('/fake', fake);
app.use('/block', block);
app.use('/notifications', notifications);
//*****************************************************************************
//****************************ROUTES*******************************************
//*****************************************************************************
const test_erreur = require('./test_tchat.js');
app.use('/test_erreur', test_erreur);
app.get('/test', (req, res) => {
	console.log(req.session.flash);
	if (req.session.test){
		res.locals.error = req.session.test;
		req.session.test = undefined;
	}
	// res.send("salut");
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
	else {
		var Message = require('./models/Message');
		Message.create(req.body.message, function (){
			req.flash('success', "Merci petit chat!");
			res.redirect('/test');  // pour rediriger vers une url
		})
	}
});
//**************404************************************************************
app.use(function(req, res, next){
	res.setHeader('Content-Type', 'text/plain');
	res.status(404).send('Page introuvable');
});
