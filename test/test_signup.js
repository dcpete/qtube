const expect = require("chai").expect;

const testuser = require('./test_config').creds.signup;
const badcreds = require('./test_config').creds.bad;
const fn = require('./test_functions');

describe("AUTH - SIGNUP (not authenticated)", () => {
  let token = null;
  
  it("should return an error if any of the fields are empty", () => {
    // No email
    return fn.createTestUser(null, testuser.username, testuser.password)
      .then(res => {
        expect(res.status).to.be.equal(400);
        return fn.createTestUser(testuser.email, null, testuser.password);
      })
      .then(res => {
        expect(res.status).to.be.equal(400);
        return fn.createTestUser(testuser.email, testuser.username, null)
      })
      .then(res => {
        expect(res.status).to.be.equal(400);
      });
  });
  it("should return an error if email is not proper format", () => {
    return fn.createTestUser(badcreds.notemailformat, testuser.username, testuser.password)
      .then(res => {
        expect(res.status).to.be.equal(400);
      });
  });
  it("should return an error if password less than 8 characters", () => {
    return fn.createTestUser(testuser.email, testuser.username, badcreds.shortPassword)
      .then(res => {
        expect(res.status).to.be.equal(400);
      });
  });
  it("should allow a user to sign up", () => {
    return fn.createTestUser(testuser.email, testuser.username, testuser.password)
      .then(res => {
        expect(res.status).to.be.equal(201);
        expect(res.body.token).to.exist;
        token = res.body.token;
      })
  });
  it("should return 409 if email already associated with user", () => {
    return fn.createTestUser('sweetsunday@gmail.com', testuser.username, testuser.password)
      .then(res => {
        expect(res.status).to.be.equal(409);
      });
  })

  after(() => {
    expect(token).to.exist;
    return fn.deleteTestUser(token)
      .then(res => {
        expect(res.status).to.be.equal(200);
      })
  });
});
