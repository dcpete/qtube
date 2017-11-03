const mongoose = require('mongoose');

const ChannelSchema = mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: ''
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  playlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'YoutubeVideo'
  }],
  currentVideo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'YoutubeVideo',
    default: null
  },
  currentVideoStarted: {
    type: Date,
    default: null
  },
  playing: {
    type: Boolean,
    default: false
  }
});

/**
 * Create a new channel
 * @param {string} name 
 * @param {string} owner 
 * @param {function} callback 
 */
const createChannel = function (name, owner, callback) {
  const newChannel = new this({
    name: name,
    owner: owner
  });
  newChannel.save(callback);
}

/**
 * Get a specific channel by its _id
 * @param {string} id 
 * @param {function} callback
 */
const getChannel = function (id, callback) {
  this
    .findById(id)
    .populate('owner', ['username', 'id'])
    .populate('playlist')
    .populate('currentVideo')
    .exec(callback);
}

/**
 * Delete a channel by its _id
 * @param {string} id 
 * @param {function} callback 
 */
const deleteChannel = function (id, callback) {
  this
    .findById(id)
    .populate('owner')
    .exec((error, channel) => {
      // Return 500 for error querying channel
      if (error || !channel) {
        callback(new Error("Error querying for channel"));
      }
      // Try to delete channel  
      else {
        channel.remove(callback);
      }
  });
}

const searchChannel = function (params, callback) {
  this
    .find(params)
    .exec((error, channels) => {
      if (error) {
        callback(new Error("Error querying for channel"));
      }
      else {
        callback(null, channels);
      }
    })
}

ChannelSchema.statics.create = createChannel;
ChannelSchema.statics.get = getChannel;
ChannelSchema.statics.delete = deleteChannel;
ChannelSchema.statics.search = searchChannel;

module.exports = mongoose.model('Channel', ChannelSchema);