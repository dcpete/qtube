const Channel = require('../../models/model_channel');
const _ = require('lodash');

const channelCallback = (res, error, channel) => {
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
}

// Create a channel
const createChannel = (req, res, next) => {
  Channel.create(req.body.name, req.user)
    .then(channel => {
      const loc = `/api/channels/${channel._id}`;
      res.location(loc).status(201).json(channel);
    });
};

// Get a specific channel by _id
const getChannelById = (req, res, next) => {
  Channel.getByID(req.params.channelid, (error, channel) => {
    channelCallback(res, error, channel);
  });
};

// Get a list of channels by search term
const getChannelBySearchTerm = (req, res, next) => {
  if (!req.query || _.isEmpty(req.query)) {
    res.status(400).json({
      message: 'Request must supply a query'
    });
  }
  else {
    Channel.search(req.query, (error, channels) => {
      channelCallback(res, error, channels);
    });
  }
};

// Edit a specific channel
const editChannel = (req, res, next) => {
  if (_.isEmpty(req.body.action) || _.isEmpty(req.body.payload)) {
    res.status(400).json({
      message: 'Request sent with nothing to update'
    });
  }
  else {
    const channelId = req.params._id;
    const user = req.user;
    const action = req.body.action;
    const payload = req.body.payload;
    switch (action) {
      case 'changeName':
        Channel.edit(channelId, user, action, payload, (error, channel) => {
          channelCallback(res, error, channel);
        });
        break;
      case 'addVideo':
        Channel.addVideo(channelId, payload.youtubeId, (error, channel) => {
          channelCallback(res, error, channel);
        })
        break;
      default:
        res.status(400).json({
          message: 'Bad request action'
        });
    }
  }
};

// Delete a specific channel
const deleteChannel = (req, res, next) => {
  Channel.delete(req.params._id, req.user)
    .then(channel => {
      res.json(channel);
    });
};

module.exports = {
  create: createChannel,
  getById: getChannelById,
  getBySearchTerm: getChannelBySearchTerm,
  edit: editChannel,
  delete: deleteChannel
};