const expect = require("chai").expect;

const testuser = require('./test_config').creds.channels;
const otheruser = require('./test_config').creds.login;
const fn = require('./test_functions');

describe("API - CHANNELS (authenticated)", () => {
  let ownerToken = null;
  let notOwnerToken = null;
  let url = null;
  let youtubeDbId = null;
  const testYoutubeId = 'A52--FKUQgU';

  before((done) => {
    // Create user for testing "not owner" operations
    fn.createTestUser(otheruser.email, otheruser.username, otheruser.password, (err, res) => {
      expect(err).to.not.exist;
      expect(res.status).to.be.equal(201);
      expect(res.body.token).to.exist;
      notOwnerToken = res.body.token;
    })
    fn.createTestUser(testuser.email, testuser.username, testuser.password, (err, res) => {
      expect(err).to.not.exist;
      expect(res.status).to.be.equal(201);
      expect(res.body.token).to.exist;
      ownerToken = res.body.token;
      done();
    });
  });

  it("should be able to create a channel if authenticated", (done) => {
    expect(ownerToken).to.exist;
    fn.createChannel(ownerToken, "test channel", (err, res) => {
      expect(res.status).to.be.equal(201);
      if (err) {
        console.log(err);
      } 
      url = res.headers.location;
      done();
    });
  });
  
  it("should let channel owner change the channel name", (done) => {
    expect(url).to.exist;
    expect(ownerToken).to.exist;
    const body = {
      action: 'changeName',
      payload: {
        name: 'changed name'
      }
    }
    fn.editChannel(ownerToken, url, body, (err, res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body.name).to.be.equal(body.payload.name);
      done();
    })
  });

  it("should let channel owner add videos to the channel", (done) => {
    expect(url).to.exist;
    expect(ownerToken).to.exist;
    const body = {
      action: 'addVideo',
      payload: {
        youtubeId: testYoutubeId
      }
    }
    fn.editChannel(ownerToken, url, body, (err, res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body.playlist).to.exist;
      const playlist = res.body.playlist;
      expect(playlist.length).to.be.equal(1);
      expect(playlist[0].video.youtubeId).to.be.equal(body.payload.youtubeId);
      youtubeDbId = playlist[0].video._id;
      done();
    })
  });
  it.skip("should let channel owner change the currently playing video");
  it("should return 403 when notOwner changes channel name", (done) => {
    expect(url).to.exist;
    expect(notOwnerToken).to.exist;
    const body = {
      action: 'changeName',
      payload: {
        name: 'changed name'
      }
    }
    fn.editChannel(notOwnerToken, url, body, (err, res) => {
      expect(res.status).to.be.equal(403);
      done();
    })
  });

  it("should return 403 when user deletes a channel owned by another user", (done) => {
    expect(url).to.exist;
    expect(notOwnerToken).to.exist;
    fn.deleteChannel(notOwnerToken, url, (err, res) => {
      expect(res.status).to.be.equal(403);
      done();
    });
  });

  it("should be able to delete a channel if owner", (done) => {
    expect(url).to.exist;
    expect(ownerToken).to.exist;
    fn.deleteChannel(ownerToken, url, (err, res) => {
      expect(res.status).to.be.equal(200);
      done();
    });
  });

  after((done) => {
    fn.deleteTestUser(notOwnerToken, (err, res) => {
      expect(err).to.not.exist;
      expect(res.status).to.be.equal(200);
    });
    fn.deleteTestUser(ownerToken, (err, res) => {
      expect(err).to.not.exist;
      expect(res.status).to.be.equal(200);
      done();
    });
  });
});

describe("API - CHANNELS (not authenticated)", () => {
  var token = null;
  var testChannel1 = null;
  var testChannel2 = null;
  var testChannel3 = null;

  before((done) => {
    fn.createTestUser(testuser.email, testuser.username, testuser.password, (err, res) => {
      expect(err).to.not.exist;
      expect(res.body.token).to.exist;
      expect(res.body.user).to.exist;
      testUserToken = res.body.token;
      testUser = res.body.user;
      fn.createChannel(testUserToken, "test channel 1", (err, res) => {
        expect(res.status).to.be.equal(201);
        expect(res.headers.location).to.exist;
        expect(res.body).to.exist;
        testChannel1 = res.body;
        testChannel1.url = res.headers.location;
      });
      fn.createChannel(testUserToken, "test channel 2", (err, res) => {
        expect(res.status).to.be.equal(201);
        expect(res.headers.location).to.exist;
        expect(res.body).to.exist;
        testChannel2 = res.body;
        testChannel2.url = res.headers.location;
      });
      fn.createChannel(testUserToken, "test channel 3", (err, res) => {
        expect(res.status).to.be.equal(201);
        expect(res.headers.location).to.exist;
        expect(res.body).to.exist;
        testChannel3 = res.body;
        testChannel3.url = res.headers.location;
        done();
      });
    });
  });

  it("should return 400 if search with no query", (done) => {
    fn.getChannels('', (err, res) => {
      expect(res.status).to.be.equal(400);
      done();
    });
  });
  
  it("should find a channel from a query", (done) => {
    const query = "name=test+channel+1";
    fn.getChannels(query, (err, res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body.length).to.be.equal(1);
      expect(res.body[0].name).to.be.equal("test channel 1");
      done();
    });
  });

  it("should find multiple channels from a query", (done) => {
    const query = "name=test+channel";
    fn.getChannels(query, (err, res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body.length).to.be.equal(3);
      done();
    });
  });

  it("should return 401 for unauthenticated channel create", (done) => {
    fn.createChannel(null, "test channel", (err, res) => {
      expect(res.status).to.be.equal(401);
      done();
    });
  });
  
  it("should return 401 for unauthenticated channel delete", (done) => {
    fn.deleteChannel(null, testChannel1.url, (err, res) => {
      expect(res.status).to.be.equal(401);
      done();
    });
  });

  after((done) => {
    fn.deleteChannel(testUserToken, testChannel1.url, () => {
      fn.deleteChannel(testUserToken, testChannel2.url, () => {
        fn.deleteChannel(testUserToken, testChannel3.url, () => {
          fn.deleteTestUser(testUserToken, (err, res) => {
            done();
          });
        });
      });
    });
  })
});
