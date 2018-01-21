const expect = require("chai").expect;

const testuser = require('./test_config').creds.signup;
const badcreds = require('./test_config').creds.bad;
const fn = require('./test_functions');

describe("AUTH - SIGNUP (not authenticated)", () => {
  let token = null;
  
  it("should return an error if any of the fields are empty", (done) => {
    // No email
    fn.createTestUser(null, testuser.username, testuser.password, (err, res) => {
      expect(res.status).to.be.equal(400);
    });
    // No username
    fn.createTestUser(testuser.email, null, testuser.password, (err, res) => {
      expect(res.status).to.be.equal(400);
    });
    // No password
    fn.createTestUser(testuser.email, testuser.username, null, (err, res) => {
      expect(res.status).to.be.equal(400);
    });
    done();
  });
  it("should return an error if email is not proper format", (done) => {
    // No email
    fn.createTestUser(badcreds.notemailformat, testuser.username, testuser.password, (err, res) => {
      expect(res.status).to.be.equal(400);
    });
    done();
  });
  it("should return an error if password less than 8 characters", (done) => {
    // No email
    fn.createTestUser(testuser.email, testuser.username, badcreds.shortPassword, (err, res) => {
      expect(res.status).to.be.equal(400);
    });
    done();
  });
  it("should allow a user to sign up", (done) => {
    fn.createTestUser(testuser.email, testuser.username, testuser.password, (err, res) => {
      expect(res.status).to.be.equal(201);
      expect(res.body.user._id).to.exist;
      expect(res.body.token).to.exist;
      token = res.body.token;
      done();
    });
  });
  it("should return 409 if email already associated with user", (done) => {
    fn.createTestUser(testuser.email, testuser.username, testuser.password, (err, res) => {
      expect(res.status).to.be.equal(409);
      done();
    });
  })

  after((done) => {
    fn.deleteTestUser(token);
    done();
  });
});
