const _ = require('lodash');
const mongoose = require('mongoose');
const YoutubeVideo = require('./model_youtube_video');
const shajs = require('sha.js');

const schema = mongoose.Schema({
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
  playlist: [
    {
      added: {
        type: Date,
        default: Date.now
      },
      playcount: {
        type: Number,
        default: 0
      },
      video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'YoutubeVideo'
      },
      pid: {
        type: String,
        default: ''
      }
    }
  ],
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
  },
  cid: {
    type: String,
    default: '',
    unique: true
  }
});
schema.post('save', (doc) => {
  if (!doc.cid) {
    doc.cid = shajs('sha256')
      .update(doc._id.toString())
      .digest('hex')
      .substring(0, 24);
    doc
      .update({ 'cid': doc.cid })
      .exec();
  }
})
schema.set('toJSON', {
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
  }
})

/**
 * Create a new channel
 * @param {string} name 
 * @param {string} owner 
 * @param {function} callback 
 */
const createChannel = function (name, owner) {
  const newChannel = new this({
    name: name,
    owner: owner
  });
  return newChannel.save();
}

/**
 * Get a specific channel by its cid
 * @param {string} id 
 * @returns {Promise} 
 */
const getChannelByID = function (cid) {
  return this
    .finOne({ cid: cid })
    .populate('owner')
    .populate('playlist')
    .populate('currentVideo')
    .exec();
}

/**
 * Delete a channel by its cid
 * @param {string} id 
 * @param {function} callback 
 */
const deleteChannel = function (cid, user) {
  return this
    .findOne({ cid: cid })
    .populate('owner')
    .exec()
    .then(channel => {
      if (!channel) {
        const error = new Error("Channel not found");
        error.status = 404;
        throw error;
      }
      else if (channel.owner.uid === user.uid) {
        return this
          .findOneAndDelete({ cid: cid })
          .exec();
      }
      else {
        const error = new Error("Not authorized to edit channel");
        error.status = 403;
        throw error;
      }
    });
}

const searchChannel = function (params) {
  // Make each parameter a regex so exact match not required
  Object.keys(params).forEach((key) => {
    params[key] = { $regex: params[key], $options: 'i' };
  })
  return this
    .find(params)
    .exec()
}

const editChannel = function (cid, user, change) {
  return this
    .findOne({ cid: cid })
    .populate('owner')
    .exec()
    .then(channel => {
      if (!channel) {
        const error = new Error("Channel not found");
        error.status = 404;
        throw error;
      }
      else if (channel.owner.uid === user.uid) {
        return this
          .findOneAndUpdate(
            { cid: cid },
            { $set: change },
            { new: true }
          )
          .exec();
      }
      else {
        const error = new Error("Not authorized to edit channel");
        error.status = 403;
        throw error;
      }
    });
}


const addVideoToChannel = function (cid, body) {
  let targetChannel = undefined;
  // body should have { addVideo: <youtubeId> }
  const youtubeId = body.addVideo;
  return this.findOne({ cid: cid })
    .populate({
      path: 'playlist',
      populate: {
        path: 'video'
      }
    })
    .exec()
    .then(channel => {
      if (!channel) {
        const error = new Error("Channel not found");
        error.name = "NotFoundError";
        throw error;
      }
      else {
        targetChannel = channel;
        return YoutubeVideo.getByYoutubeId(youtubeId);
      }
    })
    .then(video => {
      if (!video) {
        return YoutubeVideo.create(youtubeId);
      }
      else {
        return video;
      }
    })
    .then(video => {
      targetChannel.playlist.push({
        added: Date.now(),
        playcount: 0,
        video: video,
        vid: shajs('sha256')
          .update(mongoose.Types.ObjectId().toString())
          .digest('hex')
          .substring(0, 24)
      });
      return targetChannel.save();
    });
}


schema.statics.create = createChannel;
schema.statics.getByID = getChannelByID;
schema.statics.delete = deleteChannel;
schema.statics.search = searchChannel;
schema.statics.edit = editChannel;
schema.statics.addVideo = addVideoToChannel;

module.exports = mongoose.model('Channel', schema);
