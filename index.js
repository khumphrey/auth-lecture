const express = require('express'),
	app = express(),
	session = require('express-session'),
	passport = require('passport'),
	User = require('./db').User;

app.listen(1337, () => console.log('strangely listenting at port 1337'))

app.use(session({
	secret: 'suNNy b3ach3s',
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser( (id, done) => {
	User.findById(id)
		.then(user => done(null, user))
		.catch(done);
})

app.use('/login', require('./auth.js'));

app.use(express.static('public'));