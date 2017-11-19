const express     = require('express');
const _           = require('lodash');
const joi         = require('joi');
const validator   = require('express-joi-validation')({});
const authutil    = require('../util/util_auth');

const router      = new express.Router();

const joiUserSignup = joi.object({
  username: joi.string().min(1).max(16).required(),
  email: joi.string().email().required(),
  password: joi.string().min(8).required()
});

const joiUserLogin = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).required()
});

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
router.post('/signup', validator.body(joiUserSignup), (req, res, next) => {
  authutil.signUp(req, (error, user, token) => {
    if (error) {
      switch (error.name) {
        case 'ValidationError':
          res.status(400).json(formatMongooseError(error));
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
router.post('/login', validator.body(joiUserLogin), (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  authutil.logIn(req, (error, user, token) => {
    console.log('route auth error ' + error);
    console.log('route auth user ' + user);
    console.log('route auth token ' + token);
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