const expect = require("chai").expect;

const testuser = require('./test_config').creds.login;
const badcreds = require('./test_config').creds.bad;
const fn = require('./test_functions');

describe("AUTH - LOGIN (not authenticated)", () => {
  let token = null;
  
  before((done) => {
    // Create the user to test login
    fn.createTestUser(testuser.email, testuser.username, testuser.password, (err, res) => {
      token = res.body.token;
      done();
    });
  });

  it("should allow a user to login", (done) => {
    fn.logInTestUser(testuser.email, testuser.password, (err, res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body.user.username).to.be.equal(testuser.username);
      done();
    });
  });
  it("should return 400 for an email in a bad format", (done) => {
    fn.logInTestUser(badcreds.notemailformat, testuser.password, (err, res) => {
      expect(res.status).to.be.equal(400);
      done();
    });
  });
  it("should return 400 for a password that is too short", (done) => {
    fn.logInTestUser(testuser.email, badcreds.shortPassword, (err, res) => {
      expect(res.status).to.be.equal(400);
      done();
    });
  });
  it("should return 401 for an unknown email", (done) => {
    fn.logInTestUser(badcreds.unknownEmail, testuser.password, (err, res) => {
      expect(res.status).to.be.equal(401);
      done();
    });
  });
  it("should return 401 for a bad password", (done) => {
    fn.logInTestUser(testuser.email, badcreds.incorrectPassword, (err, res) => {
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