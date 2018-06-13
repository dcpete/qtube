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
    })
    .catch(next);
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
  Channel.edit(req.params._id, req.user, req.body)
    .then(channel => {
      res.json(channel);
    })
    .catch(next);
};

// Delete a specific channel
const deleteChannel = (req, res, next) => {
  Channel.delete(req.params._id, req.user)
    .then(channel => {
      res.json(channel);
    })
    .catch(next);
};

module.exports = {
  create: createChannel,
  getById: getChannelById,
  getBySearchTerm: getChannelBySearchTerm,
  edit: editChannel,
  delete: deleteChannel
};