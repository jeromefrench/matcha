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
const middleware = require('./middlewares/middleware.js');
const completed = require('./middlewares/completed.js');
const restricted_logon = require('./middlewares/restricted_logon.js');
const database = require('./connection_database.js');
const test = require('./views/test_dir/test.js');


rootPath = __dirname;

db = database.makeConn(config);



users = [];
bell = 0;

app.set('view engine', 'ejs');
app.set('trust proxy', true) //ip
//----------middle ware
app.use(function(req,res,next){ req.io = io; next(); })
app.use('/assets', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(session({ secret: 'sdjfkl', resave: false, saveUninitialized: true, cookie: { secure: false } }));
app.use(require('./middlewares/flash'));
app.use(fileUpload({ useTempFiles : true, tempFileDir : __dirname+'/public/tmp', createParentPath : true }));
app.use(requestIp.mw())

app.use(middleware());
app.use(restricted_logon());
app.use(completed());
//-----------------ans check_field field
app.use('/confirm', confirm);
app.use('/forgotten-passwd', sendpass);
app.use('/change-passwd', changepass);
app.use('/faker', faker);
app.use('/sign-up', signup);
app.use('/sign-in', signin);
//---------------------------------restricted to logon-------------------------
app.use('/sign-out', signout);
app.use('/my-account', myaccount);
app.use('/about-you', aboutyou);
//---------------------------------restricted to completed-------------------------
app.use('/profile', profile);
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
app.get('/error', function(req, res){
	res.send("Une erreur c'est produire");
});
app.use(function(req, res, next){
	res.render('main_view/404.ejs');
});
