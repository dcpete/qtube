/*
const expect = require("chai").expect;

const testuser = require('./test_config').creds.channels;
const fn = require('./test_functions');

describe("VIDEOS (model functions)", (done) => {
  let testvideo = null;
  it.skip("should be able to create a video", (done) => {
    // https://www.youtube.com/watch?v=NouZB6QuCys
    fn.createVideo("NouZB6QuCys", (error, video) => {
      expect(video).to.exist;
      testvideo = video;
      done();
    });
  });
  it.skip("should not be able to add a duplicate video", (done) => {
    fn.createVideo("NouZB6QuCys", (error, video) => {
      expect(error).to.exist;
      done();
    });
  });
  it.skip("should be able to get video by its youtube ID", (done) => {
    fn.getVideo("NouZB6QuCys", (error, video) => {
      expect(video).to.exist;
      done();
    })
  });

  after(done => {
    fn.deleteVideo(testvideo._id, (error, video) => {
      expect(error).to.not.exist;
      expect(video).to.exist;
      done();
    });
  })
});
*/