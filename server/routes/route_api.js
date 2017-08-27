const express     = require('express');
const Channel     = require('../models/model_channel');
const User        = require('../models/model_user');
const validator   = require('validator');
const _           = require('lodash');

const router      = new express.Router();

/*
========================================
Channels
========================================
*/
const validateChannel = (payload) => {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || !payload.name) {
    isFormValid = false;
    errors.name = 'Please provide a name for this channel';
  }
  else {
    if (typeof payload.name !== 'string') {
      isFormValid = false;
      errors.name = 'Channel name must be a string';
    }
  }

  if (!isFormValid) {
    message = 'Error creating channel';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
};

const getChannelStub = () => {}

// Get list of all channels
router.get('/channels', (req, res, next) => {
  Channel
    .find({})
    .populate('owner', 'username')
    .exec((error, channels) => {
      if (error) {
        return res.status(500).json({
          message: 'Could not retrieve channels'
        });
      }
      res.json(channels);
    });
});

// Create a channel
router.post('/channels', (req, res, next) => {
  const validationResult = validateChannel(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }

  const newChannel = new Channel();
  newChannel.name = req.body.name;
  newChannel.owner = req.user;
  newChannel.save((error, channel) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Could not create channel"
      });
    }
    // Successful channel creation
    return res.status(201).json({
      success: true,
      message: 'Channel was successfully created',
      channel: _.omit(channel.toJSON(), 'owner.local')
    });
  });
});

// Get a specific channel
router.get('/channels/:channelid', (req, res, next) => {
  const channelid = req.params.channelid;
  Channel
    .findById(channelid)
    .populate('owner', 'username')
    .populate('playlist')
    .populate('currentVideo')
    .exec((error, channel) => {
      if (error) {
        console.log("Error: " + error);
        return res.status(500).json({
          message: 'Could not retrieve channel'
        });
      }
      if (!channel) {
        return res.status(404).json({
          message: 'Could not find channel'
        })
      }
      res.json(channel);
    });
});

// Delete a specific channel
router.delete('/channels/:channelid', (req, res, next) => {
  const channelid = req.params.channelid;
  
  Channel
    .findById(channelid)
    .populate('owner')
    .exec((error, channel) => {
      // Return 500 for error querying channel
      if (error) {
        console.log("Error: " + error);
        return res.status(500).json({
          message: 'Could not retrieve channel'
        });
      }
      // Return 404 for channel not found
      else if (!channel) {
        return res.status(404).json({
          message: 'Channel not found'
        })
      }
      // Return 403 if user does not own channel  
      else if (channel.owner._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: 'User does not own channel'
        });
      }
      // Try to delete channel  
      else {
        channel
          .remove((error, channel) => {
            // Return 500 if error deleting channel
            if (error) {
              console.log("Error: " + error);
              return res.status(500).json({
                message: 'Could not delete channel'
              });
            }
            // Return 200 and channel for successful delete
            res.json(channel);
          });
      }
    });
});

/*
========================================
YoutubeVideos
========================================
*/

/*
========================================
Users
========================================
*/

/**
 * Get a specific user
 */
router.get('/users/:userid', (req, res, next) => {
  const userid = req.params.userid;
  User
    .findById(userid)
    .exec((error, user) => {
      if (error) {
        console.log("Error: " + error);
        return res.status(500).json({
          message: 'Could not retrieve user'
        });
      }
      if (!user) {
        return res.status(404).json({
          message: 'Could not find user'
        })
      }
      res.json(_.omit(user.toJSON(), ['local', 'email', '__v']));
    });
});

/**
 * Validate user
 */

/**
 * Change username
 */

/**
 * Delete a user
 */
router.delete('/users/:userid', (req, res, next) => {
  const userid = req.params.userid;

  User
    .findById(userid)
    .exec((error, user) => {
      // Return 500 for error querying user
      if (error) {
        console.log("Error: " + error);
        return res.status(500).json({
          message: 'Could not retrieve user'
        });
      }
      // Return 404 for user not found
      else if (!user) {
        return res.status(404).json({
          message: 'User not found'
        })
      }
      // Return 403 if user does not own user  
      else if (user._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: 'Cannot delete another user'
        });
      }
      // Try to delete user  
      else {
        user
          .remove((error, user) => {
            // Return 500 if error deleting user
            if (error) {
              console.log("Error: " + error);
              return res.status(500).json({
                message: 'Could not delete user'
              });
            }
            // Return 200 and user for successful delete
            res.json(_.omit(user.toJSON(), ['local', 'email', '__v']));
          });
      }
    });
});


module.exports = router;