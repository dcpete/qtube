const google = require('googleapis');
const API_KEY = require('../config/config_google').API_KEY;

const getVideoById = (youtubeid, callback) => {
  const youtube = google.youtube('v3');
  const response = youtube.videos.list({
    part: 'contentDetails,snippet',
    id: youtubeid,
    key: API_KEY
  }, (error, response) => {
    if (error) {
      error = new Error("Error getting video from Youtube");
      error.name = "CommunicationError";
      callback(error);
    }
    else if (!response || !response.items || response.items.length === 0) {
      error = new Error("Youtube video not found");
      error.name = "NotFoundError";
      callback(error);
    }
    else {
      const video = response.items[0];
      callback(error, video); 
    }
  })
}

const getDurationInSec = function(duration) {
  var output = [];
  var durationInSec = 0;
  var matches = duration.match(/P(?:(\d*)Y)?(?:(\d*)M)?(?:(\d*)W)?(?:(\d*)D)?T(?:(\d*)H)?(?:(\d*)M)?(?:(\d*)S)?/i);
  var parts = [
    { // years
      pos: 1,
      multiplier: 86400 * 365
    },
    { // months
      pos: 2,
      multiplier: 86400 * 30
    },
    { // weeks
      pos: 3,
      multiplier: 604800
    },
    { // days
      pos: 4,
      multiplier: 86400
    },
    { // hours
      pos: 5,
      multiplier: 3600
    },
    { // minutes
      pos: 6,
      multiplier: 60
    },
    { // seconds
      pos: 7,
      multiplier: 1
    }
  ];
  for (var i = 0; i < parts.length; i++) {
    if (typeof matches[parts[i].pos] !== 'undefined') {
      durationInSec += parseInt(matches[parts[i].pos]) * parts[i].multiplier;
    }
  }
  return durationInSec;
};

exports.getVideoById = getVideoById;
exports.getDurationInSec = getDurationInSec;