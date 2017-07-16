var mongoose = require('mongoose');

var youtubeVideoSchema = mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: '',
    trim: true,
    unique: true,
    required: 'YoutubeVideo must have id',
    validate: [validateLength, 'id must be 11 chars in length']
  },
  thumbnail: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 0
  },
  addedby: {
    type: Schema.Types.ObjectId,
    ref: User
  },
  playcount: {
    type: Number,
    default: 0 
  }
});

/**
 * id validation
 */
function validateLength (v) {
  return v.length === 11;
}

mongoose.model('YoutubeVideo', youtubeVideoSchema);
