const User = require('../models/model_user');
const jwtutil = require('./util_jwt');

const logIn = (req, done) => {
  const email = req.body.email;
  const password = req.body.password;

  // find a user by email address
  return User.getUserSensitiveInfo(email, (err, user) => {
    if (err) {
      // Error looking up the user in the database
      const error = new Error('Error retrieving user ' + email);
      error.name = 'DatabaseError';
      return done(error);
    }
    else if (!user) {
      // No user with that email address exists
      const error = new Error('Incorrect email or password');
      error.name = 'CredentialsError';
      return done(error);
    }
    else {
      // check if a hashed user's password is equal to a value saved in the database
      return user.comparePassword(password, (err, isMatch) => {
        if (err) {
          const error = new Error('Error processing password');
          error.name = 'CredentialsError';
          return done(error);
        }
        else if (!isMatch) {
          const error = new Error('Incorrect email or password');
          error.name = 'CredentialsError';
          return done(error);
        }
        else {
          return jwtutil.signToken(req, user, (err, token) => {
            return done(err, user, token);
          });
        }  
      });
    }  
  });
}

const signUp = (req, done) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  User.create(email, username, password, (err, user) => {
    if (err) {
      return done(err);
    }
    else {
      return jwtutil.signToken(req, user, (err, token) => {
        return done(err, user, token);
      });
    }
  });
}

exports.signUp = signUp;
exports.logIn = logIn;