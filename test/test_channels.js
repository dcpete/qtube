const expect = require("chai").expect;
const shajs = require('sha.js');

const testuser = require('./test_config').creds.channels.owner;
const otheruser = require('./test_config').creds.channels.notOwner;
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
      name: 'owner changed name'
    }
    return fn.editChannel(ownerToken, testChannelUrl, body)
      .then(res => {
        expect(res.status).to.be.equal(200);
        expect(res.body.name).to.be.equal(body.name);
      });
  });

  it("should let channel owner add videos to the channel", () => {
    expect(testChannelUrl).to.exist;
    expect(ownerToken).to.exist;
    const body = {
      addVideo: testYoutubeId1
    }
    return fn.addVideoToChannel(ownerToken, testChannelUrl, body)
      .then(res => {
        expect(res.status).to.be.equal(200);
        expect(res.body.playlist).to.exist;
        const playlist = res.body.playlist;
        expect(playlist.length).to.be.equal(1);
        expect(playlist[0].video.youtubeId).to.be.equal(body.addVideo);
      });
  });

  it("should let notOwner add a video to a channel", () => {
    expect(testChannelUrl).to.exist;
    expect(notOwnerToken).to.exist;
    const body = {
      addVideo: testYoutubeId2
    }
    return fn.addVideoToChannel(ownerToken, testChannelUrl, body)
      .then(res => {
        expect(res.status).to.be.equal(200);
        expect(res.body.playlist).to.exist;
        const playlist = res.body.playlist;
        expect(playlist.length).to.be.equal(2);
        expect(playlist[1].video.youtubeId).to.be.equal(body.addVideo);
      });
  });

  it.skip("should let channel owner change the currently playing video");
  it.skip("should let notOwner change the currently playing video");
  it("should return 403 when notOwner changes channel name", () => {
    expect(testChannelUrl).to.exist;
    expect(notOwnerToken).to.exist;
    const body = {
      name: 'notOwner changed name'
    }
    return fn.editChannel(notOwnerToken, testChannelUrl, body)
      .then(res => {
      expect(res.status).to.be.equal(403);
    });
  });

  it("should return 403 when user deletes a channel owned by another user", () => {
    expect(testChannelUrl).to.exist;
    expect(notOwnerToken).to.exist;
    return fn.deleteChannel(notOwnerToken, testChannelUrl)
      .then(res => {
      expect(res.status).to.be.equal(403);
    });
  });

  it("should let a channel owner delete their own channel", () => {
    expect(testChannelUrl).to.exist;
    expect(ownerToken).to.exist;
    return fn.deleteChannel(ownerToken, testChannelUrl)
      .then(res => {
        expect(res.status).to.be.equal(200);
      });
  });

  it("should return 404 for edit if no channel found", () => {
    expect(testChannelUrl).to.exist;
    expect(ownerToken).to.exist;
    const body = {
      name: 'owner changed name'
    }
    return fn.editChannel(ownerToken, testChannelUrl, body)
      .then(res => {
        expect(res.status).to.be.equal(404);
      });
  });

  it("should return 404 for delete if no channel found", () => {
    expect(testChannelUrl).to.exist;
    expect(ownerToken).to.exist;
    return fn.deleteChannel(ownerToken, testChannelUrl)
      .then(res => {
        expect(res.status).to.be.equal(404);
      });
  });

  it("should return 400 if search with no query", () => {
    return fn.getChannels('')
      .then(res => {
        expect(res.status).to.be.equal(400);
      });
  });
  
  it("should find a channel from a query", () => {
    const query = "name=test+channel+1";
    return fn.getChannels(query)
      .then(res => {
        expect(res.status).to.be.equal(200);
        expect(res.body.length).to.be.equal(1);
        expect(res.body[0].name).to.be.equal("test channel 1");
      });
  });

  it("should find multiple channels from a query", () => {
    const query = "name=test+channel";
    return fn.getChannels(query)
      .then(res => {
        expect(res.status).to.be.equal(200);
        expect(res.body.length).to.be.equal(3);
      });
  });

  it("should return 401 for unauthenticated channel create", () => {
    return fn.createChannel(null, "test channel")
      .then(res => {
        expect(res.status).to.be.equal(401);
      });
  });

  it("should return 401 for unauthenticated channel edit", () => {
    const body = {
      name: 'notOwner changed name'
    }
    return fn.editChannel(null, testChannel1.url, body)
      .then(res => {
        expect(res.status).to.be.equal(401);
      });
  });
  
  it("should return 401 for unauthenticated channel delete", () => {
    return fn.deleteChannel(null, testChannel1.url)
      .then(res => {
        expect(res.status).to.be.equal(401);
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
      })
      .then(res => {
        expect(res.status).to.be.equal(200);
      });
  });
});
