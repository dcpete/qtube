const config = require('./test_config');

const expect = require("chai").expect;
const server = require("supertest").agent(config.uri);

const createTestUser = (email, username, password, callback) => {
  return server
    .post('/auth/signup')
    .send({
      'email': email,
      'username': username,
      'password': password
    })
    .type('form')
    .end((err, res) => {
      return typeof callback === 'function' && callback(err, res);
    });
}

describe("AUTH - SIGNUP (not authenticated)", () => {
  it("should return an error if any of the fields are empty", (done) => {
    // No email
    exports.createTestUser(null, config.signup.username, config.signup.password, (err, res) => {
      expect(res.status).to.be.equal(400);
    });
    // No username
    exports.createTestUser(config.signup.email, null, config.signup.password, (err, res) => {
      expect(res.status).to.be.equal(400);
    });
    // No password
    exports.createTestUser(config.signup.email, config.signup.username, null, (err, res) => {
      expect(res.status).to.be.equal(400);
    });
    done();
  });
  it("should return an error if email is not proper format", (done) => {
    // No email
    exports.createTestUser(config.bademail, config.signup.username, config.signup.password, (err, res) => {
      expect(res.status).to.be.equal(400);
    });
    done();
  });
  it("should return an error if password less than 8 characters", (done) => {
    // No email
    exports.createTestUser(config.signup.email, config.signup.username, config.shortPassword, (err, res) => {
      expect(res.status).to.be.equal(400);
    });
    done();
  });
  it("should allow a user to sign up", (done) => {
    exports.createTestUser(config.signup.email, config.signup.username, config.signup.password, (err, res) => {
      expect(res.status).to.be.equal(201);
      done();
    });
  });
});

exports.createTestUser = createTestUser;