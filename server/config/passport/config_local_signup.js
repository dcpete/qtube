const User                    = require('../../models/model_user');
const PassportLocalStrategy   = require('passport-local').Strategy;
const getToken                = require('../../middleware/middle_jwt').getToken;

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
  // check if this email has already been used to create a user
  User.findOne({ 'email': req.body.email, 'username': username }, function (err, user) {
    // if there are any errors, return the error
    if (err)
      return done(err);
    if (user) {
      const error = new Error("Error creating user (duplicate user).");
      error.details = {};
      if (user.username === username) {
        error.details.username = "Username has been taken."
      }
      if (user.email === req.body.email) {
        error.details.email = "Email address has been used to create an account.";
      }
      error.name = 'DuplicateUserError';
      return done(error);
    }
    else {
      // create new user
      var newUser = new User();

      // set the user's local credentials
      newUser.email = req.body.email;
      newUser.local.password = newUser.hashPassword(password);
      newUser.username = username;

      // save the user
      newUser.save(function (err, user) {
        if (err) {
          return done(err);
        }
        else {
          getToken(user, (token) => {
            return done(null, user, token);
          })
        }
      });
    }
  });
});