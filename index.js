const express = require('express'),
	app = express(),
	expressSession = require('express-session'),
	passport = require('passport'),
	User = require('./db').User;

app.listen(1337, () => console.log('strangely listening at port 1337'))

// this MUST be before passport.session() which wraps around express-session
app.use(expressSession({
	secret: 'suNNy b3ach3s', // hash used when making the unique IDs
	resave: false, //don't resave if the session object hasn't changed
	saveUninitialized: false // do save session object even if we don't add anything to it
}));

//we should now have req.session

//initializes passport to allow for OAuth strategies
app.use(passport.initialize());

// passport.session() acts as a middleware to alter the req object and change the 'user' value that is currently the session id (from the client cookie) into the true deserialized user object. It does this through the functions registered below `serializeUser` and `deserializeUser`
app.use(passport.session());

// This says I have found the user and passed it to done
	// now we say hey session hold on to this data we will serialize. 
	// What data we send to done as the second parameter is what will be stored as the session object
passport.serializeUser((user, done) => {
	done(null, user.id);
});


// Now a new request is coming in. 
	// Based on the cookie go lookup this client and the serialized string we stored
	// What we send into done as the second parameter is what will be stored as the `req.user`
passport.deserializeUser( (id, done) => {
	User.findById(id)
		.then(user => {
			done(null, user)
		})
		.catch(done);
})

app.use('/login', require('./auth.js'));

app.use(express.static('public'));


