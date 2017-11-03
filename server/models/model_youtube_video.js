const mongoose = require('mongoose');

const youtubeVideoSchema = mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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

module.exports = mongoose.model('YoutubeVideo', youtubeVideoSchema);
