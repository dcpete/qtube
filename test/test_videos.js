const expect = require("chai").expect;
const mongoose = require('mongoose');
const dbconfig = require('../src/server/config/config_database');
const testuser = require('./test_config').creds.channels;
const fn = require('./test_functions');

describe("VIDEOS (no direct api call)", () => {
  let testvideo = null;
  // https://www.youtube.com/watch?v=NouZB6QuCys
  const testYoutubeVideoId = "NouZB6QuCys";
  before(() => {
    return mongoose.connect(dbconfig.uri)
      .then(connection => {
        mongoose.Promise = global.Promise;
    });
  })
  
  it("should be able to create a video", () => {
    return fn.createVideo(testYoutubeVideoId)  
      .then(video => {
        expect(video).to.exist;
        expect(video.youtubeId).to.equal(testYoutubeVideoId);
        testvideo = video;
      });
  });
  it("should not be able to add a duplicate video", () => {
    return fn.createVideo(testYoutubeVideoId)
      .then(video => {
        expect(video).to.not.exist;
      })
      .catch(err => {
        expect(err).to.exist;
        expect(err.name).to.equal("DuplicateEntryError");
        expect(err.status).to.equal(409);
      });
  });
  it("should be able to get video by its youtube ID", () => {
    return fn.getVideo(testYoutubeVideoId)
      .then(video => {
        expect(video).to.exist;
        expect(video.youtubeId).to.equal(testYoutubeVideoId);
      });
  });
  it("should be able to delete a video", () => {
    return fn.deleteVideo(testYoutubeVideoId)
      .then(video => {
        expect(video.youtubeId).to.equal(testYoutubeVideoId);
      });
  });

  after(() => {
    return mongoose.connection.close();
  });
});