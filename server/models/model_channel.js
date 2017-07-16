var mongoose = require('mongoose'),

var channelSchema = mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: ''
  },
  playlist: [{
    type: Schema.Types.ObjectId,
    ref: 'YoutubeVideo'
  }],
  currentVideo: {
    type: Schema.Types.ObjectId,
    ref: 'YoutubeVideo'
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

mongoose.model('Channel', channelSchema);
