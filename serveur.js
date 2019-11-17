let express = require('express');
let app = express();
let bodyParser = require("body-parser");
let session = require("express-session");  //pour avoir les variables de session
var server = app.listen(8080);
var connection = [];
const fileUpload = require('express-fileupload');

var socket = require('socket.io');
var io = socket(server);
console.log("my socket server is running");
io.sockets.on('connection', newConnection);
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

//moteur de template
app.set('view engine', 'ejs'); //set le template engine pour express
//MIDDLE WARES*****************************************************************
app.use('/assets', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(session({ 
	secret: 'sdjfkl',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }
}));
app.use(require('./middlewares/flash'));
app.use(fileUpload({
	    useTempFiles : true,
	tempFileDir : __dirname+'/public/tmp',
createParentPath : true
}));


var rootPath = __dirname;



//*****************************************************************************
//****************************ROUTES*******************************************
//*****************************************************************************
//**************/**************************************************************
app.get('/', function(req, res){
	res.redirect('/sign-in');  // pour rediriger vers une url
});
//**************SIGN OUT*******************************************************
var ctrl_sign_out = require('./controler/sign_out.js');
app.get('/sign-out', function(req, res){
	ctrl_sign_out.ctrl_signOutGet(req, res);
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
	ctrl_about_you.ctrl_aboutYouPost(req, res, rootPath);
});
//**************PROFILE / :LOGIN***********************************************
var ctrl_profile_login = require('./controler/profile_login.js');
app.get('/profile/:login', function(req, res){
	ctrl_profile_login.ctrl_profileLoginGet(req, res);
});
//*************LIKE THIS USER BUTTON*******************************************
var ctrl_like_this_user = require('./controler/like-this-user.js');
app.get('/like-this-user/:login', function(req, res){
	ctrl_like_this_user.ctrl_like_this_userGet(req, res);
});
//**************LIST USER ECHERCHER********************************************
var ctrl_research = require('./controler/research.js');
app.get('/research', function(req, res){
	ctrl_research.ctrl_researchGet(req, res);
});
app.post('/research', function(req, res){
	ctrl_research.ctrl_researchPost(req, res);
});

//***************CONFIRMATION**************************************************
var ctrl_confirm = require('./controler/confirm.js');
app.get('/confirm/:login/:num', function(req, res){
	ctrl_confirm.ctrl_confirmGet(req, res);
});

//*****************ENVOI MOT DE PASSE OUBLIE***********************************
var ctrl_send_passwd = require('./controler/forgotten-passwd.js');
app.get('/forgotten-passwd', function(req, res){
	ctrl_send_passwd.ctrl_send_passGet(req, res);
});
app.post('/forgotten-passwd', function (req, res){
	ctrl_send_passwd.ctrl_send_passPost(req, res);
});

//*****************CHGMT PASSWD************************************************
var ctrl_changePass = require('./controler/change-passwd.js');
app.get('/change-passwd/:login/:num', function(req, res){
	ctrl_changePass.ctrl_changePassGet(req, res);
});
app.post('/change-passwd/:login/:num', function (req, res){
	ctrl_changePass.ctrl_changePassPost(req, res);
});

//**************CHAT***********************************************************
var ctrl_chat = require('./controler/chat.js');
app.get('/chat/:login', function(req, res){
	ctrl_chat.ctrl_chatGet(req, res);
});
app.post('/chat/:login', function(req, res){
	ctrl_chat.ctrl_chatPost(req, res);
});
//**************DEL PICURE*****************************************************
var ctrl_delPic = require('./controler/delPic.js');
app.get('/public/photo/:login/:num', function(req, res){
	ctrl_delPic.ctrl_delPicGet(req, res);
});
//**************MAKE AS PROFILE PICURE*****************************************
var ctrl_makeProfilePic = require('./controler/make_profile_pic.js');
app.get('/public/photo/:login/:num/profile', function(req, res){
	ctrl_makeProfilePic.ctrl_makeProfilePic(req, res);
});


//**************FAAKER BABY****************************************************
var faker = require('./faker.js');
app.get('/faker', function(req, res){
	faker.faker(req, res);
});



//*****************************************************************************

//**************404************************************************************
app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable');
});






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

