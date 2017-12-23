const express = require('express');
const channelRoutes = require('./api/route_channels');
const userRoutes = require('./api/route_users');
const joi = require('../config/config_joi');
const validator = require('express-joi-validation')({});

const router = new express.Router();

//router.use('/channels', channelRoutes);

// Create channel
router.post('/channels', validator.body(joi.channel), channelRoutes.create);
// Get channel by id
router.get('/channels/:_id', validator.params(joi.mongoId), channelRoutes.getById);
// Get list of channels by search term
router.get('/channels', validator.query(joi.channel), channelRoutes.getBySearchTerm);  
// Edit specific channel
router.patch('/channels/:_id', validator.params(joi.mongoId), validator.body(joi.channeEdit), channelRoutes.edit);
// Delete channel  
router.delete('/channels/:_id', validator.params(joi.mongoId), channelRoutes.delete);
  
//router.use('/users', userRoutes);
// Get user by id
router.get('/users/:userid', userRoutes.getById);
// Edit user  
router.patch('/users', validator.body(joi.userEdit), userRoutes.edit);
// Delete user
router.delete('/users', userRoutes.delete);
    
module.exports = router;