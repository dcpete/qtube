const express = require('express');
const _ = require('lodash');
const validator = require('express-joi-validation').createValidator({});
const joi = require('../config/config_joi');
const User = require('../models/model_user');
const signToken = require('../util/util_jwt').signToken;

const router = new express.Router();

/**
 * Sign up (create) a user
 */
router.post('/signup', validator.body(joi.userSignup), (req, res, next) => {
  User.createUser(req.body)  
    .then(user => {
      req.user = user;
      return signToken(req);
    })
    .then(token => {
      const payload = {
        username: req.user.username,
        email: req.user.email,
        uid: req.user.uid,
        token
      }
      const loc = `/api/users/${req.user.username}`;
      res.location(loc).status(201).json(payload);
    })
    .catch(next);
});

/**
 * Authenticate a user
 */
router.post('/login', validator.body(joi.userLogin), (req, res, next) => {
  User.logInUser(req.body)
    .then(user => {
      req.user = user;
      return signToken(req);
    })
    .then(token => {
      const payload = {
        username: req.user.username,
        email: req.user.email,
        uid: req.user.uid,
        token
      }
      res.json(payload);
    })
    .catch(next);
});

module.exports = router;