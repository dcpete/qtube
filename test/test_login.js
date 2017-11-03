const config          = require('./test_config');

const expect          = require("chai").expect;
const server          = require("supertest").agent(config.uri);

const createTestUser  = require('./test_signup').createTestUser;

const logInTestUser = (email, password, callback) => {
  return server
    .post('/auth/login')
    .send({
      'email': email,
      'password': password
    })
    .type('form')
    .end((err, res) => {
      return typeof callback === 'function' && callback(err, res);
    });
}

describe("AUTH - LOGIN (not authenticated)", () => {
  before((done) => {
    // Create the user to test login
    createTestUser(config.login.email, config.login.username, config.login.password, () => {
      done();
    });
  });

  it("should allow a user to login", (done) => {
    logInTestUser(config.login.email, config.login.password, (err, res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body.user.username).to.be.equal(config.login.username);
      done();
    });
  });
  it("should return 400 for an email in a bad format", (done) => {
    logInTestUser(config.bademail, config.login.password, (err, res) => {
      expect(res.status).to.be.equal(400);
      done();
    });
  });
  it("should return 400 for a password that is too short", (done) => {
    logInTestUser(config.login.email, config.shortPassword, (err, res) => {
      expect(res.status).to.be.equal(400);
      done();
    });
  });
  it("should return 401 for an unknown email", (done) => {
    logInTestUser(config.unknownEmail, config.login.password, (err, res) => {
      expect(res.status).to.be.equal(401);
      done();
    });
  });
  it("should return 401 for a bad password", (done) => {
    logInTestUser(config.login.email, config.incorrectPassword, (err, res) => {
      expect(res.status).to.be.equal(401);
      done();
    });
  });
});

exports.logInTestUser = logInTestUser;