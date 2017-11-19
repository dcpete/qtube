const config          = require('./test_config');

const expect          = require("chai").expect;
const server          = require("supertest").agent(config.uri);

const fn = require('./test_functions');

describe("API - CHANNELS (authenticated)", () => {
  let id = null;
  let token = null;
  let url = null;

  before((done) => {
    fn.createTestUser(config.creds.channels.email, config.creds.channels.username, config.creds.channels.password, (err, res) => {
      expect(err).to.not.exist;
      expect(res.body.token).to.exist;
      expect(res.body.user._id).to.exist;
      token = res.body.token;
      id = res.body.user._id;
      done();
    });
  });

  it("should be able to create a channel if authenticated", (done) => {
    expect(token).to.exist;
    fn.createChannel(token, "test channel", (err, res) => {
      expect(res.status).to.be.equal(201);
      url = res.headers.location;
      done();
    });
  });
  
  it("should be able to change the channel name", (done) => {
    const updatedName = 'changed name';
    expect(url).to.exist;
    expect(token).to.exist;
    fn.editChannel(token, url, { name: updatedName }, (err, res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body.name).to.be.equal(updatedName);
      done();
    })
  });

  it("should be able to delete a channel if authenticated", (done) => {
    expect(url).to.exist;
    expect(token).to.exist;
    fn.deleteChannel(token, url, (err, res) => {
      expect(res.status).to.be.equal(200);
      done();
    });
  });

  it.skip("should be able to add videos to the channel");
  it.skip("should be able to change the currently playing video");
  it.skip("should not be able to alter another user's channel");
  it.skip("should not be able to delete another user's channel");

  after((done) => {
    fn.deleteTestUser(token, (err, res) => {
      if (err) {
      }
      expect(res.status).to.be.equal(200);
      done();
    });
  });
});

// Get rid of sharing test users between test files, localize to each one
// Export the emails/passwords if they need to be cleaned up later (i.e. haven't tested delete yet)
// Also, try to figure out why mongo is cool with duplicate users right now


describe("API - CHANNELS (not authenticated)", () => {
  var token = null;
  var testChannel1 = null;
  var testChannel2 = null;
  var testChannel3 = null;

  before((done) => {
    fn.createTestUser(config.creds.channels.email, config.creds.channels.username, config.creds.channels.password, (err, res) => {
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
    server
      .get("/api/channels")
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });
  
  it("should find a channel from a query", (done) => {
    server
      .get("/api/channels?name=test+channel+1")
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.exist;
        expect(res.body.name).to.equal()
        done();
      });
  });
  it.skip("should find multiple channels from a query");

  it.skip("should return 401 for any unauthenticated POST request", (done) => {
    server
      .post("/api/channels")
      .expect("Content-type", /json/)
      .expect(401)
      .end((err, res) => {
        expect(res.status).to.be.equal(401);
        done();
      });
  });
  
  it.skip("should return 401 for any unauthenticated DELETE request", (done) => {
    server
      .delete("/api/channels")
      .expect("Content-type", /json/)
      .expect(401)
      .end((err, res) => {
        expect(res.status).to.be.equal(401);
        done();
      });
  });

  after((done) => {
    fn.deleteChannel(testUserToken, testChannel1.url);
    fn.deleteChannel(testUserToken, testChannel2.url);
    fn.deleteChannel(testUserToken, testChannel3.url);
    fn.deleteTestUser(testUserToken, (err, res) => {
      done();
    });
  })
});