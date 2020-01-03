const bdd = require('./models/about_you.js');
const express = require('express');
const app = express();
var server = app.listen(8080);
const fileUpload = require('express-fileupload');
const session = require("express-session");
const bodyParser = require("body-parser");
const io = require('socket.io')(server, { pingTimeout: 60000, });
const requestIp = require('request-ip');
const socketFile = require('./socket.js')(io);
const signout = require('./controler/sign_out.js');
const signup = require('./controler/sign_up.js');
const signin = require('./controler/sign_in.js');
const myaccount = require('./controler/my_account.js');
const aboutyou = require('./controler/about_you.js');
const profile = require('./controler/profile.js');
const like = require('./controler/like-this-user.js');
const research = require('./controler/research.js');
const confirm = require('./controler/confirm.js');
const sendpass = require('./controler/forgotten-passwd.js');
const changepass = require('./controler/change-passwd.js');
const photo = require('./controler/photo.js');
const faker = require('./faker.js');
const dashboard = require('./controler/dashboard.js');
const chat = require('./controler/chat.js');
const fake = require('./controler/fake.js');
const block = require('./controler/block.js');
const notifications = require('./controler/notifications.js');
const  middleware = require('./middleware.js');
const  completed = require('./completed.js');
const  restricted_logon = require('./restricted_logon.js');
const database = require('./connection_database.js');
const test = require('./views/test_dir/test.js');
//rootPath = __dirname;
app.set('view engine', 'ejs');
app.set('trust proxy', true) //ip
db = database.makeConn(config);
users = [];
bell = 0;
//----------middle ware
app.use(function(req,res,next){ req.io = io; next(); })
app.use('/assets', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(session({ secret: 'sdjfkl', resave: false, saveUninitialized: true, cookie: { secure: false } }));
app.use(require('./middlewares/flash'));
app.use(fileUpload({ useTempFiles : true, tempFileDir : __dirname+'/public/tmp', createParentPath : true }));
app.use(requestIp.mw())
//-----------------ans check_field field
app.use(middleware());
app.use('/confirm', confirm);
app.use('/forgotten-passwd', sendpass);
app.use('/change-passwd', changepass);
app.use('/faker', faker);
//---------------------------------restricted to logon-------------------------
app.use(restricted_logon());
app.use('/sign-out', signout);
app.use('/sign-up', signup);
app.use('/sign-in', signin);
app.use('/my-account', myaccount);
//---------------------------------restricted to completed-------------------------
app.use(completed());
app.use('/about-you', aboutyou);
app.use('/profile/', profile);
app.use('/like-this-user', like);
app.use('/research', research);
app.use('/public/photo', photo);
app.use('/chat', chat);
app.use('/dashboard', dashboard);
app.use('/fake', fake);
app.use('/block', block);
app.use('/notifications', notifications);
app.use('/test', test);
app.get('/', function(req, res){
	if (req.session.logon) {
		res.redirect('/about-you');
	}else{
		res.redirect('/sign-in');
	}
});
app.use(function(req, res, next){
	res.setHeader('Content-Type', 'text/plain');
	res.status(404).send('Page introuvable');
});
//*****************************************************************************
//****************************ROUTES*******************************************
//*****************************************************************************
// const test_erreur = require('./test_tchat.js');
// app.use('/test_erreur', test_erreur);
// app.get('/test', (req, res) => {
// 	console.log(req.session.flash);
// 	if (req.session.test){
// 		res.locals.error = req.session.test;
// 		req.session.test = undefined;
// 	}
// 	// res.send("salut");
// 	res.render('index', {test : 'Salut'});
// });
// app.post('/test', (req, res) => {
// 	// console.log(req.body);
// 	if (req.body.message == undefined || req.body.message == ""){
// 		req.flash('error', "Vous n'avez pas poste de message");
// 		req.session.test = "Il y a une erreur";
// 		res.redirect('/test');  // pour rediriger vers une url
// 		// res.render('index', {error: "Vous n'avez pas entrez de message",
// 		// 					test: "salut"});
// 	}
// 	else {
// 		var Message = require('./models/Message');
// 		Message.create(req.body.message, function (){
// 			req.flash('success', "Merci petit chat!");
// 			res.redirect('/test');  // pour rediriger vers une url
// 		})
// 	}
// });
//**************404************************************************************
