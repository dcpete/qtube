const config          = require('./test_config');

const expect          = require("chai").expect;
const server          = require("supertest").agent(config.uri);

const fn  = require('./test_functions');

describe("AUTH - LOGIN (not authenticated)", () => {
  let token = null;
  
  before((done) => {
    // Create the user to test login
    fn.createTestUser(config.creds.login.email, config.creds.login.username, config.creds.login.password, (err, res) => {
      token = res.body.token;
      done();
    });
  });

  it("should allow a user to login", (done) => {
    fn.logInTestUser(config.creds.login.email, config.creds.login.password, (err, res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body.user.username).to.be.equal(config.creds.login.username);
      done();
    });
  });
  it("should return 400 for an email in a bad format", (done) => {
    fn.logInTestUser(config.creds.bad.notemailformat, config.creds.login.password, (err, res) => {
      expect(res.status).to.be.equal(400);
      done();
    });
  });
  it("should return 400 for a password that is too short", (done) => {
    fn.logInTestUser(config.creds.login.email, config.creds.bad.shortPassword, (err, res) => {
      expect(res.status).to.be.equal(400);
      done();
    });
  });
  it("should return 401 for an unknown email", (done) => {
    fn.logInTestUser(config.creds.bad.unknownEmail, config.creds.login.password, (err, res) => {
      expect(res.status).to.be.equal(401);
      done();
    });
  });
  it("should return 401 for a bad password", (done) => {
    fn.logInTestUser(config.creds.login.email, config.creds.bad.incorrectPassword, (err, res) => {
      expect(res.status).to.be.equal(401);
      done();
    });
  });

  after((done) => {
    fn.deleteTestUser(token, () => {
      done();
    });
  });
});