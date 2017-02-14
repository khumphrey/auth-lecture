require('./secrets');

const router = require('express').Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('./db').User;

// This is the route that users hit when they click Sign In With Google
router.get('/google', passport.authenticate('google', { scope: 'email' }));

// This is the route that the Provider sends the user back to (along with the temporary auth token)
// after they "sign the contract".
//
// passport.authenticate will automatically send us to google (with the auth token and our client secret),
// and once we clear things with google, we will return to our verification callback with the permanent
// user token and any profile information we're allowed to see
router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/success.html',
    failureRedirect: '/error.html'
  })
);

const googleCredentials = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
};

const verificationCallback = function (token, refreshToken, profile, done) {
  const info = {
    name: profile.displayName,
    email: profile.emails[0].value,
  };

  User.findOrCreate({
    where: { googleId: profile.id },
    defaults: info
  })
    .spread(function (user) {
      done(null, user); // the user we pass to done here is piped through passport.serializeUser
    })
    .catch(done);
};

// after we findOrCreate a user, we 'serialize' our user on the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

const strategy = new GoogleStrategy(googleCredentials, verificationCallback);

// configuring the strategy (credentials + verification callback)
// this is used by 'passport.authenticate'
passport.use(strategy);

module.exports = router;
