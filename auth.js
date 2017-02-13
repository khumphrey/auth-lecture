const router = require('express').Router(),
	passport = require('passport'),
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	User = require('./db').User;

// configuring the strategy (credentials + verification callback)
passport.use(
  new GoogleStrategy({
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
    .spread(function (user) {
      done(null, user);
    })
    .catch(done);
  })
);

// Google authentication and login (notice this is passport.authenticate)
router.get('/google', passport.authenticate('google', { scope: 'email' }));

// handle the callback after Google has authenticated the user (notice the use of passport.authenticate that takes slightly different variables! AHHHHHH WHYYYYY???!)
router.get('/verify',
  passport.authenticate('google', { failureRedirect: '/error.html' }),
  function (req, res) {
    res.redirect(`/success.html`);
  }
);

module.exports = router;