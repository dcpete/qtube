const express     = require('express');
const Channel     = require('../models/model_channel');
const validator   = require('validator');

const router      = new express.Router();

// Test route for authentication
router.get('/dashboard', (req, res) => {
  console.log("user: " + req.user);
  res.status(200).json({
    message: "You're authorized to see this secret message"
  });
});

/*
========================================
Channels
========================================
*/
function validateChannel(payload) {
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
      errors.name = 'Channel name must be alphanumeric';
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
  newChannel.save((error) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Could not create channel"
      });
    }
    // Successful user creation
    return res.status(200).json({
      success: true,
      message: 'Channel was successfully created'
    });
  });
});

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

//router.post('/channels/:channelid/addvideo')

/*
========================================
YoutubeVideos
========================================
*/

module.exports = router;