const config          = require('./test_config');

const expect          = require("chai").expect;
const server          = require("supertest").agent(config.uri);

const createTestUser  = require('./test_signup').createTestUser;
const logInTestUser   = require("./test_login").logInTestUser;

const deleteTestUser = (userid, token, callback) => {
  return server
    .delete("/api/users/" + userid)
    .set("Authorization", "Bearer " + token)
    .end((err, res) => {
      return typeof callback === 'function' && callback(err, res);
    });
}

describe("API - USER MANAGEMENT (not authenticated)", () => {
  it.skip("should return info about a given user");
  it.skip("should get a list of all users");
});

describe("API - USER MANAGEMENT (authenticated)", () => {
  var id = null;
  var token = null;

  before((done) => {
    createTestUser(config.email, config.username, config.password, (err, res) => {
      logInTestUser(config.email, config.password, (err, res) => {
        expect(res.body.user._id).to.exist;
        expect(res.body.token).to.exist;
        id = res.body.user._id;
        token = res.body.token;
        done();
      });
    });
  });

  it.skip("should let a user change their username");
  it.skip("should let a user change their password")
  it("should not let a user delete another user", (done) => {
    createTestUser(config.email2, config.username2, config.password2, (err1, res1) => {
      deleteTestUser(id, res1.body.token, (err2, res2) => {
        expect(res2.status).to.be.equal(403);
      });
      deleteTestUser(res1.body.user._id, res1.body.token, (err3, res3) => {
        done();
      });
    })
  });
  // Note, this should always be the last test in this describe
  it("should let a user delete itself", (done) => {
    deleteTestUser(id, token, (err, res) => {
      expect(res.status).to.be.equal(200);
      done();
    });
  });
});

exports.deleteTestUser = deleteTestUser;