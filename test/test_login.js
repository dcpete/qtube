const expect = require("chai").expect;

const testuser = require('./test_config').creds.login;
const badcreds = require('./test_config').creds.bad;
const fn = require('./test_functions');

describe("AUTH - LOGIN (not authenticated)", () => {
  let token = null;
  
  before(() => {
    // Create the user to test login
    return fn.createTestUser(testuser.email, testuser.username, testuser.password)
      .then(res => {
        token = res.body.token;
      });
  });

  it("should allow a user to login", () => {
    return fn.logInTestUser(testuser.email, testuser.password)
      .then(res => {
        expect(res.status).to.be.equal(200);
        expect(res.body.username).to.be.equal(testuser.username);
      })
  });

  it("should return 400 for an email in a bad format", () => {
    return fn.logInTestUser(badcreds.notemailformat, testuser.password)
      .then(res => {
        expect(res.status).to.be.equal(400);
      })
  });

  it("should return 400 for a password that is too short", () => {
    return fn.logInTestUser(testuser.email, badcreds.shortPassword)
      .then(res => {
        expect(res.status).to.be.equal(400);
      });
  });
  it("should return 401 for an unknown email", () => {
    return fn.logInTestUser(badcreds.unknownEmail, testuser.password)
      .then(res => {
        expect(res.status).to.be.equal(401);
      })
  });

  it("should return 401 for a bad password", () => {
    return fn.logInTestUser(testuser.email, badcreds.incorrectPassword)
      .then(res => {
        expect(res.status).to.be.equal(401);
      });
  });

  after(() => {
    expect(token).to.exist;
    return fn.deleteTestUser(token)
      .then(res => {
        expect(res.status).to.be.equal(200);
      });
  });
});