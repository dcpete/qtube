const expect = require("chai").expect;

const testuser = require('./test_config').creds.channels;
const otheruser = require('./test_config').creds.login;
const fn = require('./test_functions');

describe("CHANNELS (/api/channels)", () => {
  let ownerToken = null;
  let notOwnerToken = null;
  let testChannelUrl = null;
  let youtubeDbId = null;
  const testYoutubeId1 = 'A52--FKUQgU';
  const testYoutubeId2 = '73dc1D8YHBg';
  var token = null;
  var testChannel1 = null;
  var testChannel2 = null;
  var testChannel3 = null;

  before(() => {
    // Create user for testing "not owner" operations
    return fn.createTestUser({
      email: otheruser.email,
      username: otheruser.username,
      password: otheruser.password
    })
      .then(res => {
        expect(res.status).to.be.equal(201);
        expect(res.body.token).to.exist;
        notOwnerToken = res.body.token;
        return fn.createTestUser({
          email: testuser.email,
          username: testuser.username,
          password: testuser.password
        });
      })
      .then(res => {
        expect(res.status).to.be.equal(201);
        expect(res.body.token).to.exist;
        ownerToken = res.body.token;
        return fn.createChannel(ownerToken, "test channel 1");
      })
      .then(res => {
        expect(res.status).to.be.equal(201);
        expect(res.headers.location).to.exist;
        expect(res.body).to.exist;
        testChannel1 = res.body;
        testChannel1.url = res.headers.location;
        return fn.createChannel(ownerToken, "test channel 2");
      })  
      .then(res => {
        expect(res.status).to.be.equal(201);
        expect(res.headers.location).to.exist;
        expect(res.body).to.exist;
        testChannel2 = res.body;
        testChannel2.url = res.headers.location;
        return fn.createChannel(ownerToken, "test channel 3")
      })  
      .then(res => {
        expect(res.status).to.be.equal(201);
        expect(res.headers.location).to.exist;
        expect(res.body).to.exist;
        testChannel3 = res.body;
        testChannel3.url = res.headers.location;
      });
  });

  it("should be able to create a channel if authenticated", () => {
    expect(ownerToken).to.exist;
    return fn.createChannel(ownerToken, "test channel")
      .then(res => {
        expect(res.status).to.be.equal(201);
        testChannelUrl = res.headers.location;
      });
  });
  
  it("should let channel owner change the channel name", () => {
    expect(testChannelUrl).to.exist;
    expect(ownerToken).to.exist;
    const body = {
      name: 'changed name'
    }
    return fn.editChannel(ownerToken, testChannelUrl, body)
      .then(res => {
        expect(res.status).to.be.equal(200);
        expect(res.body.name).to.be.equal(body.name);
      })
  });

  it.skip("should let channel owner add videos to the channel", (done) => {
    expect(testChannelUrl).to.exist;
    expect(ownerToken).to.exist;
    const body = {
      action: 'addVideo',
      payload: {
        youtubeId: testYoutubeId1
      }
    }
    fn.editChannel(ownerToken, testChannelUrl, body, (err, res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body.playlist).to.exist;
      const playlist = res.body.playlist;
      expect(playlist.length).to.be.equal(1);
      expect(playlist[0].video.youtubeId).to.be.equal(body.payload.youtubeId);
      youtubeDbId = playlist[0].video._id;
      done();
    });
  });
  it.skip("should let notOwner add a video to a channel", (done) => {
    expect(testChannelUrl).to.exist;
    expect(notOwnerToken).to.exist;
    const body = {
      action: 'addVideo',
      payload: {
        youtubeId: testYoutubeId2
      }
    }
    fn.editChannel(notOwnerToken, testChannelUrl, body, (err, res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body.playlist).to.exist;
      const playlist = res.body.playlist;
      expect(playlist.length).to.be.equal(2);
      expect(playlist[1].video.youtubeId).to.be.equal(body.payload.youtubeId);
      done();
    });
  });
  it.skip("should let channel owner change the currently playing video");
  it.skip("should let notOwner change the currently playing video");
  it.skip("should return 403 when notOwner changes channel name", (done) => {
    expect(testChannelUrl).to.exist;
    expect(notOwnerToken).to.exist;
    const body = {
      action: 'changeName',
      payload: {
        name: 'changed name'
      }
    }
    fn.editChannel(notOwnerToken, testChannelUrl, body, (err, res) => {
      expect(res.status).to.be.equal(403);
      done();
    });
  });

  it.skip("should return 403 when user deletes a channel owned by another user", (done) => {
    expect(testChannelUrl).to.exist;
    expect(notOwnerToken).to.exist;
    fn.deleteChannel(notOwnerToken, testChannelUrl, (err, res) => {
      expect(res.status).to.be.equal(403);
      done();
    });
  });

  it("should let a channel owner delete said channel", () => {
    expect(testChannelUrl).to.exist;
    expect(ownerToken).to.exist;
    return fn.deleteChannel(ownerToken, testChannelUrl)
      .then(res => {
        expect(res.status).to.be.equal(200);
      });
  });

  it.skip("should return 400 if search with no query", (done) => {
    fn.getChannels('', (err, res) => {
      expect(res.status).to.be.equal(400);
      done();
    });
  });
  
  it.skip("should find a channel from a query", (done) => {
    const query = "name=test+channel+1";
    fn.getChannels(query, (err, res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body.length).to.be.equal(1);
      expect(res.body[0].name).to.be.equal("test channel 1");
      done();
    });
  });

  it.skip("should find multiple channels from a query", (done) => {
    const query = "name=test+channel";
    fn.getChannels(query, (err, res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body.length).to.be.equal(3);
      done();
    });
  });

  it.skip("should return 401 for unauthenticated channel create", (done) => {
    fn.createChannel(null, "test channel", (err, res) => {
      expect(res.status).to.be.equal(401);
      done();
    });
  });
  
  it.skip("should return 401 for unauthenticated channel delete", (done) => {
    fn.deleteChannel(null, testChannel1.url, (err, res) => {
      expect(res.status).to.be.equal(401);
      done();
    });
  });

  after(() => {
    return fn.deleteChannel(ownerToken, testChannel1.url)
      .then(res => {
        expect(res.status).to.be.equal(200);
        return fn.deleteChannel(ownerToken, testChannel2.url);
      })
      .then(res => {
        expect(res.status).to.be.equal(200);
        return fn.deleteChannel(ownerToken, testChannel3.url);
      })
      .then(res => {
        expect(res.status).to.be.equal(200);
        return fn.deleteTestUser(ownerToken);
      })
      .then(res => {
        expect(res.status).to.be.equal(200);
        return fn.deleteTestUser(notOwnerToken);
      });
  });
});
