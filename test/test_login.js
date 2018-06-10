const expect = require("chai").expect;

const testuser = require('./test_config').creds.login;
const badcreds = require('./test_config').creds.bad;
const fn = require('./test_functions');

describe("AUTH - LOGIN (not authenticated)", () => {
  let token = null;
  
  before(() => {
    // Create the user to test login
    return fn.createTestUser({
      email: testuser.email,
      username: testuser.username,
      password: testuser.password
    })
      .then(res => {
        token = res.body.token;
      });
  });

  it("should allow a user to login with their email address", () => {
    return fn.logInTestUser({
      email: testuser.email,
      password: testuser.password
    })
      .then(res => {
        expect(res.status).to.be.equal(200);
        expect(res.body.username).to.be.equal(testuser.username);
      })
  });

  it("should allow a user to login with their username", () => {
    return fn.logInTestUser({
      username: testuser.username,
      password: testuser.password
    })
      .then(res => {
        expect(res.status).to.be.equal(200);
        expect(res.body.username).to.be.equal(testuser.username);
      })
  });

  it("should return 400 if no email or username are supplied", () => {
    return fn.logInTestUser({
      password: testuser.password
    })
      .then(res => {
        expect(res.status).to.be.equal(400);
      })
  });
  
  it("should return 400 if both email and username are supplied", () => {
    return fn.logInTestUser({
      username: testuser.username,
      email: testuser.email,
      password: testuser.password
    })
      .then(res => {
        expect(res.status).to.be.equal(400);
      })
  });

  it("should return 400 for an email in a bad format", () => {
    return fn.logInTestUser({
      email: badcreds.notemailformat,
      password: testuser.password
    })
      .then(res => {
        expect(res.status).to.be.equal(400);
      })
  });

  it("should return 400 for a password that is too short", () => {
    return fn.logInTestUser({
      email: testuser.email,
      password: badcreds.shortPassword
    })
      .then(res => {
        expect(res.status).to.be.equal(400);
      });
  });

  it("should return 401 for an unknown username", () => {
    return fn.logInTestUser({
      username: badcreds.unknownUsername,
      password: testuser.password
    })
      .then(res => {
        expect(res.status).to.be.equal(401);
      })
  });

  it("should return 401 for an unknown email", () => {
    return fn.logInTestUser({
      email: badcreds.unknownEmail,
      password: testuser.password
    })
      .then(res => {
        expect(res.status).to.be.equal(401);
      })
  });

  it("should return 401 for a bad password", () => {
    return fn.logInTestUser({
      email: testuser.email,
      password: badcreds.incorrectPassword
    })
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