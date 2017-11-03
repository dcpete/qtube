const express     = require('express');
const Channel     = require('../models/model_channel');
const User = require('../models/model_user');
const Joi = require('joi');
const validator = require('express-joi-validation')({});
const _           = require('lodash');

const router      = new express.Router();

/*
 * ========================================
 * Joi validation objects
 * ========================================
 */
const joiUser = Joi.object({
  username: Joi.string().max(16),
  _id: Joi.string().hex().length(24).required()
});

const joiVideo = Joi.object({
  id: Joi.string().length(11).required()
})

const joiPlaylist = Joi.array().items(joiVideo);

const joiChannel = Joi.object({
  name: Joi.string().min(1).max(50),
  _id: Joi.string().length(24).hex(),
  created: Joi.date(),
  owner: joiUser,
  playlist: joiPlaylist,
  currentVideo: joiVideo,
  currentVideoStarted: Joi.date(),
  playing: Joi.boolean()
});

const joiID = Joi.object().keys({
  _id: Joi.string().length(24).hex()
});

/*
 * ========================================
 * Channels
 * ========================================
 */

// Create a channel
router.post('/channels', validator.body(joiChannel), (req, res, next) => {
  Channel.create(req.body.name, req.user, (error, channel) => {
    if (error) {
      res.status(500).json({
        message: 'Could not create channel'
      });
    }
    else {
      const loc = `/api/channels/${channel._id}`;
      res.location(loc).status(201).json(channel);
    }
  });
});

// Get a specific channel by _id
router.get('/channels/:_id', validator.params(joiID), (req, res, next) => {
  Channel.getChannel(req.params.channelid, (error, channel) => {
    if (error) {
      res.status(500).json({
        message: 'Could not retrieve channel'
      });
    }
    else if (!channel) {
      res.status(404).end;
    }
    else {
      res.json(channel);
    }  
  });
});

// Get a list of channels by search term
router.get('/channels', validator.query(joiChannel), (req, res, next) => {
  Channel.search(req.query, (error, channels) => {
    if (error) {
      res.status(500).json({
        message: 'Could not search for channels'
      });
    }
    else {
      res.json(channels);
    }
  });
});

// Edit a specific channel
/*
router.post('/channels/:_id', validator.params(joiID), validator.body(joiChannel), (req, res, next) => {
  if (req.params._id !== req.body._id) {
    res.status(400).send('Parameter and body id do not match');
  }
  else {
    Channel
      .findById(req.params._id)
    
  }
});
*/

// Delete a specific channel
router.delete('/channels/:_id', validator.params(joiID), (req, res, next) => {
  Channel.delete(req.params._id, (error, channel) => {
    if (error) {
      res.status(500).json({
        message: 'Could not delete channel'
      });
    }
    else if (!channel) {
      res.status(404).end;
    }
    else {
      res.json(channel);
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

router.delete('/users', (req, res, next) => {
  User.delete(req.user._id, (error, user) => {
    if (error) {
      res.status(500).json({
        message: 'Could not delete user'
      });
    }
    else if (!user) {
      res.status(404).end;
    }
    else {
      res.json(user);
    }
  });
});
/*
router.delete('/users', (req, res, next) => {
  console.log(req.user);
  const userid = req.user._id;

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
*/

module.exports = router;