const config          = require('./test_config');

const expect          = require("chai").expect;
const server          = require("supertest").agent(config.uri);

const fn = require("./test_functions");

describe("USERS (not authenticated)", () => {
  let id = null;
  let token = null;

  before((done) => {
    fn.createTestUser(config.creds.users.email, config.creds.users.username, config.creds.users.password, (err, res) => {
      token = res.body.token;
      id = res.body.user._id;
      done();
    });
  })
  it("should return info about a given user", (done) => {
    fn.getTestUser(id, (err, res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body._id).to.exist;
      expect(res.body._id).to.equal(id);
      expect(res.body.username).to.exist;
      expect(res.body.username).to.equal(config.creds.users.username);
      done();
    })
  });

  after((done) => {
    fn.deleteTestUser(token, (err, res) => {
      expect(res.status).to.be.equal(200);
      done();
    });
  })
});

describe("API - USER MANAGEMENT (authenticated)", () => {
  let id = null;
  let token = null;

// Even though it's not tested until later, we should create and delete users with every test.
// There shouldn't be any carryover, and tests should be able to run independently (even though
// functions might be needed).  

  before((done) => {
    fn.createTestUser(config.creds.users.email, config.creds.users.username, config.creds.users.password, (err, res) => {
      id = res.body.user._id;
      token = res.body.token;
      done();
    });
  });

  it("should let a user change their username", (done) => {
    const change = {
      username: 'newuser'
    }
    fn.editTestUser(token, change, (err, res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body).to.exist;
      expect(res.body.username).to.be.equal(change.username);
      done();
    })
  });
  it("should let a user change their password", (done) => {
    const change = {
      password: 'this is my new password'
    }
    fn.editTestUser(token, change, (err, res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body).to.exist;
      fn.logInTestUser(config.creds.users.email, change.password, (err, res) => {
        expect(res.status).to.be.equal(200);
        done();
      });
    });
  });
  // Note, this should always be the last test in this describe
  // since we're not deleting the user with an after()
  it("should let a user delete itself", (done) => {
    fn.deleteTestUser(token, (err, res) => {
      expect(res.status).to.be.equal(200);
      done();
    });
  });
});