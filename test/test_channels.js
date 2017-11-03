const config          = require('./test_config');

const expect          = require("chai").expect;
const server          = require("supertest").agent(config.uri);

const createTestUser  = require('./test_signup').createTestUser;
const logInTestUser   = require('./test_login').logInTestUser;
const deleteTestUser  = require('./test_users').deleteTestUser;

const createChannel = (token, title, callback) => {
  return server
    .post("/api/channels")
    .set("Authorization", "Bearer " + token)
    .send({ "name": title })
    .type('form')
    .end((err, res) => {
      return typeof callback === 'function' && callback(err, res);
    });
}

const deleteChannel = (token, url, callback) => {
  return server
    .delete(url)
    .set("Authorization", "Bearer " + token)
    .end((err, res) => {
      return typeof callback === 'function' && callback(err, res);
    });
}

describe("API - CHANNELS (authenticated)", () => {
  var id = null;
  var token = null;
  var url = null;

  before((done) => {
    createTestUser(config.channels.email, config.channels.username, config.channels.password, (err, res) => {
      expect(err).to.not.exist;
      expect(res.body.token).to.exist;
      expect(res.body.user._id).to.exist;
      token = res.body.token;
      id = res.body.user._id;
      done();
    });
  });

  it("should be able to create a channel if authenticated", (done) => {
    createChannel(token, "test channel", (err, res) => {
      expect(res.status).to.be.equal(201);
      url = res.headers.location;
      done();
    });
  });

  it("should be able to delete a channel if authenticated", (done) => {
    expect(url).to.exist;
    deleteChannel(token, url, (err, res) => {
      expect(res.status).to.be.equal(200);
      done();
    });
  });

  it.skip("should be able to change the title");
  it.skip("should be able to add videos to the channel");
  it.skip("should be able to change the currently playing video");
  it.skip("should not be able to alter another user's channel");
  it.skip("should not be able to delete another user's channel");

  after((done) => {
    deleteTestUser(token, (err, res) => {
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
  var testUser = null;
  var testUserToken = null;
  var testChannel1 = null;
  var testChannel2 = null;
  var testChannel3 = null;

  before((done) => {
    createTestUser(config.channels.email, config.channels.username, config.channels.password, (err, res) => {
      expect(err).to.not.exist;
      expect(res.body.token).to.exist;
      expect(res.body.user).to.exist;
      testUserToken = res.body.token;
      testUser = res.body.user;
      createChannel(testUserToken, "test channel 1", (err, res) => {
        expect(res.status).to.be.equal(201);
        expect(res.headers.location).to.exist;
        expect(res.body).to.exist;
        testChannel1 = res.body;
        testChannel1.url = res.headers.location;
      });
      createChannel(testUserToken, "test channel 2", (err, res) => {
        expect(res.status).to.be.equal(201);
        expect(res.headers.location).to.exist;
        expect(res.body).to.exist;
        testChannel2 = res.body;
        testChannel2.url = res.headers.location;
      });
      createChannel(testUserToken, "test channel 3", (err, res) => {
        expect(res.status).to.be.equal(201);
        expect(res.headers.location).to.exist;
        expect(res.body).to.exist;
        testChannel3 = res.body;
        testChannel3.url = res.headers.location;
        done();
      });
    });
  });

  it.skip("should list all channels from /api/channels", (done) => {
    server
      .get("/api/channels")
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        // HTTP status should be 200
        expect(res.status).to.equal(200);
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
  it.skip("should find all channels from an empty query")

  it("should return 401 for any unauthenticated POST request", (done) => {
    server
      .post("/api/channels")
      .expect("Content-type", /json/)
      .expect(401)
      .end((err, res) => {
        expect(res.status).to.be.equal(401);
        done();
      });
  });
  
  it("should return 401 for any unauthenticated DELETE request", (done) => {
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
    deleteTestUser(testUserToken);
    deleteChannel(testUserToken, testChannel1);
    deleteChannel(testUserToken, testChannel2);
    deleteChannel(testUserToken, testChannel3);
    done();
  })
});

exports.createChannel = createChannel;
exports.deleteChannel = deleteChannel;