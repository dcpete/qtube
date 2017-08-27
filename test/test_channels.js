const config = require('./test_config');

const expect = require("chai").expect;
const server = require("supertest").agent(config.uri);

const createTestUser = require('./test_signup').createTestUser;
const logInTestUser = require('./test_login').logInTestUser;
const deleteTestUser = require('./test_users').deleteTestUser;

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

const deleteChannel = (token, channelid, callback) => {
  return server
    .delete("/api/channels/" + channelid)
    .set("Authorization", "Bearer " + token)
    .end((err, res) => {
      return typeof callback === 'function' && callback(err, res);
    });
}

describe("API - CHANNELS (not authenticated)", () => {
  it("should list all channels from /api/channels", (done) => {
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
});

describe("API - CHANNELS (authenticated)", () => {
  var id = null;
  var token = null;  
  var channelid = null;

  before((done) => {
    createTestUser(config.email, config.username, config.password, () => {
      logInTestUser(config.email, config.password, (err, res) => {
        expect(err).to.not.exist;
        expect(res.body.token).to.exist;
        expect(res.body.user._id).to.exist;
        token = res.body.token;
        id = res.body.user._id;
        done();
      });  
    });
  });

  it("should be able to create a channel if authenticated", (done) => {
    createChannel(token, "test channel", (err, res) => {
      expect(res.status).to.be.equal(201);
      channelid = res.body.channel._id;
      done();
    });
  });

  it("should be able to delete a channel if authenticated", (done) => {
    expect(channelid).to.exist;
    deleteChannel(token, channelid, (err, res) => {
      expect(res.status).to.be.equal(200);
      done();
    });
  });

  it.skip("should be able to change the title");
  it.skip("should not be able to alter another user's channel")
  it.skip("should not be able to delete another user's channel");

  after((done) => {
    deleteTestUser(id, token, (err, res) => {
      done();
    });
  });
});

exports.createChannel = createChannel;
exports.deleteChannel = deleteChannel;