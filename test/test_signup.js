const config = require('./test_config');

const expect = require("chai").expect;
const server = require("supertest").agent(config.uri);

const fn = require('./test_functions');

describe("AUTH - SIGNUP (not authenticated)", () => {
  let token = null;
  
  it("should return an error if any of the fields are empty", (done) => {
    // No email
    fn.createTestUser(null, config.creds.signup.username, config.creds.signup.password, (err, res) => {
      expect(res.status).to.be.equal(400);
    });
    // No username
    fn.createTestUser(config.creds.signup.email, null, config.creds.signup.password, (err, res) => {
      expect(res.status).to.be.equal(400);
    });
    // No password
    fn.createTestUser(config.creds.signup.email, config.creds.signup.username, null, (err, res) => {
      expect(res.status).to.be.equal(400);
    });
    done();
  });
  it("should return an error if email is not proper format", (done) => {
    // No email
    fn.createTestUser(config.creds.bad.notemailformat, config.creds.signup.username, config.creds.signup.password, (err, res) => {
      expect(res.status).to.be.equal(400);
    });
    done();
  });
  it("should return an error if password less than 8 characters", (done) => {
    // No email
    fn.createTestUser(config.creds.signup.email, config.creds.signup.username, config.creds.bad.shortPassword, (err, res) => {
      expect(res.status).to.be.equal(400);
    });
    done();
  });
  it("should allow a user to sign up", (done) => {
    fn.createTestUser(config.creds.signup.email, config.creds.signup.username, config.creds.signup.password, (err, res) => {
      expect(res.status).to.be.equal(201);
      expect(res.body.user._id).to.exist;
      expect(res.body.token).to.exist;
      token = res.body.token;
      done();
    });
  });

  after((done) => {
    fn.deleteTestUser(token);
    done();
  });
});
