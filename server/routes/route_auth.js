const express     = require('express');
const passport    = require('passport');
const _           = require('lodash');
const joi         = require('joi');
const validator = require('express-joi-validation')({});

const router = new express.Router();

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
  passport.authenticate('local-signup', (error, user, token) => {
    if (error) {
      switch (error.name) {
        case 'ValidationError':
          res.status(401).json(formatMongooseError(error));
          break;
        default:
          res.status(500).json({
            message: 'Could not create user'
          });  
      }
    }
    else {
      const loc = `/api/users/${user._id}`;
      res.location(loc).status(201).json({
        user: user,
        token: token
      });
    }
  })(req, res, next);
});

/**
 * Authenticate a user
 */
router.post('/login', validator.body(joiUserLogin), (req, res, next) => {
  passport.authenticate('local-login', (error, user, token) => {
    if (error) {
      if (error.name === 'CredentialsError') {
        res.status(401).json(error);
      }
      else {
        console.log(error.toString());
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
  })(req, res, next);
});

module.exports = router;