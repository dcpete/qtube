const config = require('./test_config');

const expect = require("chai").expect;
const server = require("supertest").agent(config.uri);

const createTestUser = require('./test_signup').createTestUser;

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
    createTestUser(config.email, config.username, config.password, () => {
      done();
    });
  });

  it("should allow a user to login", (done) => {
    logInTestUser(config.email, config.password, (err, res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body.user.username).to.be.equal(config.username);
      done();
    });
  });
  it("should return 401 for an unknown email", (done) => {
    logInTestUser(config.bademail, config.password, (err, res) => {
      expect(res.status).to.be.equal(401);
      done();
    });
  });
  it("should return 401 for a bad password", (done) => {
    logInTestUser(config.email, config.badpassword, (err, res) => {
      expect(res.status).to.be.equal(401);
      done();
    });
  });
});

exports.logInTestUser = logInTestUser;