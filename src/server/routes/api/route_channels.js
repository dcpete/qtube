const Channel = require('../../models/model_channel');
const _ = require('lodash');

// Create a channel
const createChannel = (req, res, next) => {
  Channel.create(req.body.name, req.user)
    .then(channel => {
      const loc = `/api/channels/${channel.cid}`;
      res.location(loc).status(201).json(channel);
    })
    .catch(next);
};

// Get a specific channel by cid
const getChannelById = (req, res, next) => {
  Channel.getByID(req.params.cid, (error, channel) => {
    channelCallback(res, error, channel);
  });
};

// Get a list of channels by search term
const getChannelBySearchTerm = (req, res, next) => {
  Channel.search(req.query)
    .then(channels => {
      res.json(channels);
    })
    .catch(next);
};

// Add a video to a channel
const addVideoToChannel = (req, res, next) => {
  Channel.addVideo(req.params.cid, req.body)
    .then(channel => {
      res.json(channel);
    })
    .catch(next);
};

// Edit a specific channel
const editChannel = (req, res, next) => {
  Channel.edit(req.params.cid, req.user, req.body)
    .then(channel => {
      res.json(channel);
    })
    .catch(next);
};

// Delete a specific channel
const deleteChannel = (req, res, next) => {
  Channel.delete(req.params.cid, req.user)
    .then(channel => {
      res.json(channel);
    })
    .catch(next);
};

module.exports = {
  create: createChannel,
  getById: getChannelById,
  getBySearchTerm: getChannelBySearchTerm,
  addVideo: addVideoToChannel,
  edit: editChannel,
  delete: deleteChannel
};