var passport = require('passport');
var Auth0Strategy = require('passport-auth0');

var strategy = new Auth0Strategy({
    domain:       'jessmitch.auth0.com',
    clientID:     'yMHjqVnhvb9eWWlKpRv5UDUy3LUI18Y8',
    clientSecret: 'DGmDMELtipNYcNNwrgN6G95M11IWuHyTj23Pnpn5k7RfD-QyqrpEK3C654H0sVfS',
    callbackURL:  'https://reddit-nodejs-api-jessmitch.c9users.io/login'
  }, function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  });

passport.use(strategy);

// This is not a best practice, but we want to keep things simple for now
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = strategy;