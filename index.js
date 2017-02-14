const express = require('express'),
	app = express(),
	expressSession = require('express-session'),
	passport = require('passport'),
	User = require('./db').User;

app.listen(1337, () => console.log('lovingly listening at port 1337'))

app.use((req, res, next) => {
  console.log('=========================================')
  console.log('Before session middleware', req.session, req.user && req.user.email);
  console.log('-----------------------------------------');
  next();
});

// creates req.session and sets up our response to include a cookie, encrypted with our secret
  // by default, the name of the session id on our cookie will be 'connect.sid'
    // (but you don't need to worry about that - express-session has got you covered)
  // this MUST be before passport.session() which wraps around express-session
app.use(expressSession({
  secret: 'suNNy b3ach3s', // hash used when making the unique IDs
  resave: false, //don't resave if the session object hasn't changed
  saveUninitialized: false // do save session object even if we don't add anything to it
}));

//we should now have req.session
app.use((req, res, next) => {
  console.log('After session middleware', Object.keys(req.session), req.user && req.user.email);
  console.log('-----------------------------------------');
  next();
});


// consumes 'req.session' so that passport can know what's on the session
app.use(passport.initialize());

// This will invoke our registered 'deserializeUser' method
  // and attempt to put our user on 'req.user' based on our 'done' invocation in 'deserializeUser'
    // this will be successful if we've serialized the user on our session with an id
app.use(passport.session());

app.use((req, res, next) => {
  console.log('After passport.session', Object.keys(req.session), req.user && req.user.email);
  console.log('More detail on req.session.cookie: ', Object.keys(req.session.cookie))
  console.log('More detail on req.session.passport', req.session.passport && req.session.passport)
  console.log('=========================================')
  next();
});

// This says I have found the user and passed it to done (in auth.js). i.e. I am registering the user with the session object
  // now we say hey session we are going to serialize this data and you hold on to it and associate it with this specific session
passport.serializeUser((user, done) => {
  done(null, user.id);
});


// New request is coming in and passport.session() has been invoked which runs this function we have registered
  // Based on the cookie go lookup this client and the serialized string we stored
  // What we send into done as the second parameter is what will be stored as the `req.user`
passport.deserializeUser( (id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user)
    })
    .catch(done);
})

app.use('/auth', require('./auth.js'));

app.use(express.static('public'));
