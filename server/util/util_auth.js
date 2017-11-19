const User = require('../models/model_user');
const jwt = require('jsonwebtoken');
const jwtconfig = require('../config/config_jwt');

const logIn = (email, password, done) => {
  // find a user by email address
  return User.getUserByEmail(email, (err, user) => {
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

        const payload = {
          sub: user._id
        };

        // create a token string
        jwt.sign(payload, jwtconfig.secret, (error, token) => {
          return done(error, user, token);
        });
      });
    }  
  });
}

const signUp = (email, username, password, done) => {
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
}

/**
 * Generate an authentication token for a valid user
 */
const getToken = (user, next) => {
  const payload = {
    sub: user._id
  };

  // create a token string
  jwt.sign(payload, jwtconfig.secret, (err, token) => {
    return next(err, token);
  });
}

exports.signUp = signUp;
exports.logIn = logIn;