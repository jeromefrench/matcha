var io = require('socket.io')();
var jwtAuth = require('socketio-jwt-auth');
 



	// using middleware
	io.use(jwtAuth.authenticate({
  		secret: 'Your Secret',    // required, used to verify the token's signature
  		algorithm: 'HS256'        // optional, default to be HS256
	}, function(payload, done) {
  		// done is a callback, you can use it as follows
  		User.findOne({id: payload.sub}, function(err, user) {
    		if (err) {
      			// return error
      			console.log("erreur token");
      			return done(err);
    		}
    		if (!user) {
      			// return fail with an error message
      			console.log("erreur token user")
      			return done(null, false, 'user does not exist');
    		}
    		// return success with a user info
      			console.log("all good");
    		return done(null, user);
  		});
	}));

	io.on('connection', function(socket) {
		  console.log('Authentication passed!');
		  // now you can access user info through socket.request.user
		  // socket.request.user.logged_in will be set to true if the user was authenticated

		console.log("AAAAAAAa user is connecte");
		socket.emit('success', {
		  	message: 'success logged in!',
		  	user: socket.request.user
		});
	});
