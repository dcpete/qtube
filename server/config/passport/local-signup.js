var User                      = require('../../models/model_user');
const PassportLocalStrategy   = require('passport-local').Strategy;

module.exports = new PassportLocalStrategy({
  // override Passport's default username field
  usernameField: 'email',
  passwordField: 'password',
  // use jwt instead of sessions
  session: false,
  passReqToCallback: true
}, (req, email, password, done) => {
  // User.findOne wont fire unless data is sent back
  //process.nextTick(function () {

    // check if this email has already been used to create a user
    User.findOne({'email': email }, function (err, user) {
      // if there are any errors, return the error
      if (err)
        return done(err);
      if (user) {
        const error = new Error('That email is already taken.');
        error.name = 'DuplicateUserError';
        return done(error);
      }
      else {
        // create new user
        var newUser = new User();

        // set the user's local credentials
        newUser.email = email;
        newUser.local.password = newUser.hashPassword(password);
        newUser.username = req.body.username;

        // save the user
        newUser.save(function (err) {
          if (err)
            throw err;
          return done(null, newUser);
        });
      }
    });
  //});
});