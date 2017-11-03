const config          = require('./test_config');

const expect          = require("chai").expect;
const server          = require("supertest").agent(config.uri);

const createTestUser  = require('./test_signup').createTestUser;
const logInTestUser   = require("./test_login").logInTestUser;

const deleteTestUser = (token, callback) => {
  return server
    .delete("/api/users")
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

// Even though it's not tested until later, we should create and delete users with every test.
// There shouldn't be any carryover, and tests should be able to run independently (even though
// functions might be needed).  

  before((done) => {
    logInTestUser(config.users.email, config.users.password, (err, res) => {
      expect(res.body.user._id).to.exist;
      expect(res.body.token).to.exist;
      id = res.body.user._id;
      token = res.body.token;
      done();
    });
  });

  it.skip("should let a user change their username");
  it.skip("should let a user change their password");
  // Note, this should always be the last test in this describe
  it("should let a user delete itself", (done) => {
    deleteTestUser(token, (err, res) => {
      expect(res.status).to.be.equal(200);
      done();
    });
  });
});

exports.deleteTestUser = deleteTestUser;