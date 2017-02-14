const router = require('express').Router(),
	passport = require('passport'),
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy, // the GoogleStrategy class
	User = require('./db').User;

// configuring the Google strategy(credentials + verification callback)
  // first parameter is for the first passport.authenticate going to the Provider
  // second parameters is for the second passport.authenticate coming from the provider
const theGoogleStrategy = new GoogleStrategy({
    clientID: '904557065956-c3jal5fip47oen1e33p81fe4hu3dtugq.apps.googleusercontent.com',
    clientSecret: 'DDwaBGC6ozKhQVOxZlyKE8U6',
    callbackURL: 'http://127.0.0.1:1337/login/verify'
  },
  function (token, refreshToken, profile, done) {
    // console.log('info: ', profile)
    var info = {
      name: profile.displayName,
      email: profile.emails[0].value,
    };
    User.findOrCreate({
      where: {googleId: profile.id},
      defaults: info
    })
    .then(function ([user, boolCreated]) {
      done(null, user); //this invokes serializeUser as well as the successRedirect of the passport.authenticate that handles the response from the provider
    })
    .catch(done);
  })

//registering the strategy with passport so we can authenticate by it later
passport.use(theGoogleStrategy);

// Google authentication and login (notice this is passport.authenticate)
// If we send in an object with scope as the second parameter passport says ohhh they want me to take the user to talk to the provider
router.get('/google', passport.authenticate('google', { scope: 'email' }));

// handle the callback after Google has authenticated the user (notice the use of passport.authenticate that takes slightly different variables! AHHHHHH WHYYYYY???!)
// If we send in an object with successRedirect or failureRedirect it says we are handling something sent from the provider
router.get('/verify',
  passport.authenticate('google', { successRedirect: '/success.html', failureRedirect: '/error.html' }));

module.exports = router;


