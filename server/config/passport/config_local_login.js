const jwt                     = require('jsonwebtoken');
const User                    = require('../../models/model_user')
const PassportLocalStrategy   = require('passport-local').Strategy;
const jwtconfig               = require('../config_jwt');

/**
 * Passport Local Strategy for logging in a user
 */
module.exports = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, email, password, done) => {

  // find a user by email address
  return User.findOne({ 'email': email }, (err, user) => {
    if (err) { return done(err); }

    if (!user) {
      const error = new Error('Incorrect email or password');
      error.name = 'IncorrectCredentialsError';

      return done(error);
    }

    // check if a hashed user's password is equal to a value saved in the database
    return user.comparePassword(password, (err, isMatch) => {
      if (err) {
        console.log(err);
        return done(err);
      }

      if (!isMatch) {
        const error = new Error('Incorrect email or password');
        error.name = 'IncorrectCredentialsError';

        return done(error);
      }

      const payload = {
        sub: user._id
      };

      // create a token string
      const token = jwt.sign(payload, jwtconfig.secret);

      return done(null, user, token);
    });
  });
});