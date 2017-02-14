const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const User = require('./db').User;

app.listen(8080, () => console.log('I can hear you on port 8080'))

app.use((req, res, next) => {
  console.log('=========================================')
  console.log('Before session middleware', req.session, req.user && req.user.email);
  console.log('-----------------------------------------');
  next();
});

// creates req.session and sets up our response to include a cookie, encrypted with our secret
// by default, the name of the session id on our cookie will be 'connect.sid'
// (but you don't need to worry about that - express-session has got you covered)
app.use(session({
  secret: 'suNNy b3ach3s',
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  console.log('After session middleware', Object.keys(req.session), req.user && req.user.email);
  console.log('-----------------------------------------');
  next();
});

// consumes 'req.session' so that passport can know what's on the session
app.use(passport.initialize());

// this will invoke our registered 'deserializeUser' method
// and attempt to put our user on 'req.user'
app.use(passport.session());

app.use((req, res, next) => {
  console.log('After passport.session', Object.keys(req.session), req.user && req.user.email);
  console.log('More detail on req.session.cookie: ', Object.keys(req.session.cookie))
  console.log('More detail on req.session.passport', req.session.passport && req.session.passport)
  console.log('=========================================')
  next();
});

// if we've serialized the user on our session with an id, we look it up here
// and attach it as 'req.user'
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user))
    .catch(done);
})

app.use('/auth', require('./auth.js'));

app.use(express.static('public'));
