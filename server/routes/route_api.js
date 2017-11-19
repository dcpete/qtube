const express     = require('express');
const Channel     = require('../models/model_channel');
const User        = require('../models/model_user');
const Joi         = require('joi');
const validator   = require('express-joi-validation')({});
const _           = require('lodash');

const router      = new express.Router();

/*
 * ========================================
 * Joi validation objects
 * ========================================
 */
const joiUser = Joi.object({
  username: Joi.string().max(16),
  password: Joi.string().min(8),
  _id: Joi.string().hex().length(24).required()
});

const joiUserEdit = Joi.object({
  username: Joi.string().max(16),
  password: Joi.string().min(8)
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

const joiChannelEdit = Joi.object({
  name: Joi.string().min(1).max(50),
  owner: joiUser
})

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
  Channel.getByID(req.params.channelid, (error, channel) => {
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
  if (!req.query || _.isEmpty(req.query)) {
    res.status(400).json({
      message: 'Request must supply a query'
    });
  }
  else {
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
  }
});

// Edit a specific channel
router.patch('/channels/:_id', validator.params(joiID), validator.body(joiChannelEdit), (req, res, next) => {
  if (!req.body || _.isEmpty(req.body)) {
    res.status(400).json({
      message: 'Request sent with nothing to update'
    });
  }
  else {
    Channel.edit(req.params._id, req.user, req.body, (error, channel) => {
      if (error) {
        switch (error.name) {
          case "UnauthorizedError":
            res.status(403).send(error);
            break;
          case "NotFoundError":
            res.status(404).end();
            break;
          case "DatabaseError":
            res.status(500).send(error);
            break;
          default:
            res.status(500).end();
        }
      }
      else {
        res.json(channel);
      }
    })
  }
});

// Delete a specific channel
router.delete('/channels/:_id', validator.params(joiID), (req, res, next) => {
  Channel.delete(req.params._id, req.user, (error, channel) => {
    if (error) {
      switch (error.name) {
        case "UnauthorizedError":
          res.status(403).send(error);
          break;
        case "NotFoundError":
          res.status(404).end();
          break;
        case "DatabaseError":
          res.status(500).send(error);
          break;
        default:
          res.status(500).end();
      }
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
  User.getByID(userid, (error, user) => {
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
    res.json(user);
  });
});

/**
 * Validate user
 */

/**
 * Update user
 */
router.patch('/users', validator.body(joiUserEdit), (req, res, next) => {
  User.edit(req.user._id, req.body, (error, user) => {
    if (error) {
      res.status(500).json({
        message: 'Could not edit user'
      });
    }
    else if (!user){
      res.status(404).end;
    }
    else {
      res.json(user);
    }
  })
})

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

module.exports = router;