const User                    = require('../../models/model_user');
const PassportLocalStrategy   = require('passport-local').Strategy;
const getToken                = require('../../middleware/middle_jwt').getToken;
const joi                     = require('joi');

/**
 * Passport Local Strategy for creating a new user
 */
module.exports = new PassportLocalStrategy({
  // override Passport's default username field
  usernameField: 'username',
  passwordField: 'password',
  // use jwt instead of sessions
  session: false,
  passReqToCallback: true
}, (req, username, password, done) => {
  const email = req.body.email;
  User.create(email, username, password, (err, user) => {
    if (err) {
      return done(err);
    }
    else {
      return getToken(user, (err, token) => {
        return done(err, user, token);
      });
    }
  });
});