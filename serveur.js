const express = require('express');

const app = express();
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

app.use('/sign-out', signout);
app.use('/sign-up', signup);
app.use('/sign-in', signin);
app.use('/my-account', myaccount);
app.use('/about-you', aboutyou);
app.use('/profile/', profile);
app.use('/like-this-user', like);
app.use('/research', research);
app.use('/confirm', confirm);

//*****************************************************************************
//****************************ROUTES*******************************************
//*****************************************************************************
//**************/**************************************************************
app.get('/', function(req, res){
	res.redirect('/sign-in');  // pour rediriger vers une url
});

//***************CONFIRMATION**************************************************

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
	else
	{
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
