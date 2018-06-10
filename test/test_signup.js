const expect = require("chai").expect;

const testuser = require('./test_config').creds.signup;
const badcreds = require('./test_config').creds.bad;
const fn = require('./test_functions');

describe("AUTH - SIGNUP (not authenticated)", () => {
  let token = null;
  
  it("should return 400 if any of the fields are empty", () => {
    // No email
    return fn.createTestUser({
      email: null,
      username: testuser.username,
      password: testuser.password
    })
      .then(res => {
        expect(res.status).to.be.equal(400);
        return fn.createTestUser({
          email: testuser.email,
          username: null,
          password: testuser.password
        });
      })
      .then(res => {
        expect(res.status).to.be.equal(400);
        return fn.createTestUser({
          email: testuser.email,
          username: testuser.username,
          password: null
        });
      })
      .then(res => {
        expect(res.status).to.be.equal(400);
      });
  });
  it("should return 400 if email is not proper format", () => {
    return fn.createTestUser({
      email: badcreds.notemailformat,
      username: testuser.username,
      password: testuser.password
    })
      .then(res => {
        expect(res.status).to.be.equal(400);
      });
  });
  it("should return 400 if password less than 8 characters", () => {
    return fn.createTestUser({
      email: testuser.email,
      username: testuser.username,
      password: badcreds.shortPassword
    })
      .then(res => {
        expect(res.status).to.be.equal(400);
      });
  });
  it("should allow a user to sign up", () => {
    return fn.createTestUser({
      email: testuser.email,
      username: testuser.username,
      password: testuser.password
    })
      .then(res => {
        expect(res.status).to.be.equal(201);
        expect(res.body.token).to.exist;
        token = res.body.token;
      })
  });
  it("should return 409 if email already associated with user", () => {
    return fn.createTestUser({
      email: 'sweetsunday@gmail.com',
      username: testuser.username,
      password: testuser.password
    })
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
