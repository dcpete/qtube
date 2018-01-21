const express = require('express');
const _ = require('lodash');
const validator = require('express-joi-validation')({});
const authutil = require('../util/util_auth');
const joi = require('../config/config_joi');

const router = new express.Router();

const formatMongooseError = (error) => {
  newError = { }
  _.forEach(error.errors, (value, key) => {
    newError[key] = _.pick(value, ['message', 'name'])
  })
  return newError;
}

/**
 * Sign up (create) a user
 */
router.post('/signup', validator.body(joi.userSignup), (req, res, next) => {
  authutil.signUp(req, (error, user, token) => {
    if (error) {
      switch (error.name) {
        case 'ValidationError':
          // Validation is being done with Joi, so any validation errors that
          // Mongoose returns should be a unique field error
          // i.e. somebody tries to create a user with an email that is already 
          // associated with a user
          res.status(409).json(formatMongooseError(error));
          break;
        default:
          res.status(500).json({
            message: 'Could not create user'
          });
          break;
      }
    }
    else {
      const loc = `/api/users/${user._id}`;
      res.location(loc).status(201).json({
        user: user,
        token: token
      });
    }
  });
});

/**
 * Authenticate a user
 */
router.post('/login', validator.body(joi.userLogin), (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  authutil.logIn(req, (error, user, token) => {
    if (error) {
      switch (error.name) {
        case 'ValidationError':
          res.status(400).json(formatMongooseError(error));
          break;
        case 'CredentialsError':
          res.status(401).json(error);
          break;
        case 'DatabaseError':
          res.status(500).json(error);
          break;
        default:
          res.status(500).json({
            message: 'Could not log in user'
          });
      }
    }
    else {
      res.json({
        token,
        user: _.omit(user.toJSON(), 'local')
      });
    }
  });
});

module.exports = router;