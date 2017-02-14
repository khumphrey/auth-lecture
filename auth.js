const router = require('express').Router(),
	passport = require('passport'),
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy, // the GoogleStrategy class
	User = require('./db').User;

// For passport.authenticate going to the Provider to prove who we are
const googleCredentials = {
  clientID: '904557065956-c3jal5fip47oen1e33p81fe4hu3dtugq.apps.googleusercontent.com',
  clientSecret: 'DDwaBGC6ozKhQVOxZlyKE8U6',
  callbackURL: 'http://127.0.0.1:1337/auth/verify'
};

// For passport.authenticate coming from the provider to handle the user information we receive from provider
const verificationCallback = function (token, refreshToken, profile, done) {
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
};

// configuring the Google strategy(credentials + verification callback)
const theGoogleStrategy = new GoogleStrategy(googleCredentials, verificationCallback)

//registering the strategy with passport so we can authenticate by it later (passport.authenticate)
passport.use(theGoogleStrategy);

// This is the route that users hit when they click Sign In With Google
// Notice this is passport.authenticate
  // If we send in an object with scope as the second parameter passport says ohhh they want me to take the user to talk to the provider
router.get('/google', passport.authenticate('google', { scope: 'email' }));


// The below use of passport.authenticate that takes slightly different variables! AHHHHHH WHYYYYY???!
  // If we send in an object with successRedirect or failureRedirect it says we are handling something sent from the provider

// This is the route that the Provider sends the user back to (along with the temporary auth code) after they "sign the contract".
  // passport.authenticate will automatically send us to google (with the auth code and our client secret),
  // and once we clear things with google, we will return to our verification callback with the user access token and any profile information we're allowed to see
router.get('/verify', passport.authenticate('google', { 
  successRedirect: '/success.html', 
  failureRedirect: '/error.html' 
}));

module.exports = router;