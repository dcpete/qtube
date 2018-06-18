const express = require('express');
const channelRoutes = require('./api/route_channels');
const userRoutes = require('./api/route_users');
const joi = require('../config/config_joi');
const validator = require('express-joi-validation')({});

const router = new express.Router();

// Get list of channels by search term
router.get(
  '/channels',
  validator.query(joi.channelCreate),
  channelRoutes.getBySearchTerm
);

  // Create channel
router.post(
  '/channels',
  validator.body(joi.channelCreate),
  channelRoutes.create
);

// Get channel by id
router.get(
  '/channels/:_id',
  validator.params(joi.mongoId),
  channelRoutes.getById
);

// Post something to a channel
router.post(
  '/channels/:_id',
  validator.params(joi.mongoId),
  channelRoutes.addVideo
);

// Edit specific channel
router.patch(
  '/channels/:_id',
  validator.params(joi.mongoId),
  validator.body(joi.channeEdit),
  channelRoutes.edit
);

// Delete channel
router.delete(
  '/channels/:_id',
  validator.params(joi.mongoId),
  channelRoutes.delete
);
  
// Get user by username
router.get(
  '/users/:username',
  userRoutes.getUserByUsername
);

// Edit user
router.patch(
  '/users',
  validator.body(joi.userEdit),
  userRoutes.editUser
);

// Delete user
router.delete(
  '/users',
  userRoutes.deleteUser
);

module.exports = router;