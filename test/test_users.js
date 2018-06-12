const expect = require("chai").expect;

const testUser = require('./test_config').creds.users;
const badUser = require('./test_config').creds.bad;
const fn = require("./test_functions");

describe("USERS (/api/users)", () => {
  let token = null;

  before(() => {
    return fn.createTestUser({
      email: testUser.email,
      username: testUser.username,
      password: testUser.password
    })
      .then(res => {
        expect(res.body.token).to.exist;
        token = res.body.token;
      });
  });

  it("should return public info about a given user", () => {
    return fn.getTestUser(testUser.username)
      .then(res => {
        expect(res.status).to.be.equal(200);
        expect(res.body.username).to.exist;
        expect(res.body.username).to.equal(testUser.username);
        expect(res.body.email).to.exist;
        expect(res.body.email).to.equal(testUser.email);
        expect(res.body.password).to.not.exist;
      });
  });

  it("should let a user change their username", () => {
    const change = {
      username: testUser.update.username
    }
    return fn.editTestUser(token, change)
      .then(res => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.exist;
        expect(res.body.username).to.be.equal(change.username);
        // Change the username back to the original
        return fn.editTestUser(token, { username: testUser.username })
      })
      .then(res => {
        expect(res.status).to.be.equal(200);
      });
  });
  it("should let a user change their password", () => {
    const change = {
      password: testUser.update.password
    }
    return fn.editTestUser(token, change)
      .then(res => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.exist;
        // Test that the new password works for login
        return fn.logInTestUser({
          email: testUser.email,
          password: change.password
        });
      })
      .then(res => {
        expect(res.status).to.be.equal(200);
        // Change the password back to the original
        return fn.editTestUser(token, { password: testUser.password })
      })
      .then(res => {
        expect(res.status).to.be.equal(200);
      });
  });
  it("should let a user change their email", () => {
    const change = {
      email: testUser.update.email
    }
    return fn.editTestUser(token, change)
      .then(res => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.exist;
        expect(res.body.email).to.be.equal(change.email);
        // Test that the new email works for login
        return fn.logInTestUser({
          email: change.email,
          password: testUser.password
        });
      })
      .then(res => {
        expect(res.status).to.be.equal(200);
        // Change the email back to the original
        return fn.editTestUser(token, { email: testUser.email });
      })
      .then(res => {
        expect(res.status).to.be.equal(200);
      });
  });
  it("should let a user change their email and password", () => {
    const change = {
      email: testUser.update.email,
      password: testUser.update.password
    }
    return fn.editTestUser(token, change)
      .then(res => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.exist;
        expect(res.body.email).to.be.equal(change.email);
        // Test that the new email and password work
        return fn.logInTestUser({
          email: change.email, password: change.password
        });
      })
      .then(res => {
        expect(res.status).to.be.equal(200);
        // Change password and email back to the original
        return fn.editTestUser(token, {
          email: testUser.email,
          password: testUser.password
        });
      })
      .then(res => {
          expect(res.status).to.be.equal(200);
      });
  });
  it("should return 400 if empty object is sent", () => {
    const change = {}
    return fn.editTestUser(token, change)
      .then(res => {
        expect(res.status).to.be.equal(400);
      });
  });
  it("should return 400 if an unknown parameter is specified", () => {
    const change = {
      unknownParam: 'something'
    }
    return fn.editTestUser(token, change)
      .then(res => {
        expect(res.status).to.be.equal(400);
      });
  });
  it("should return 400 if the password is too short", () => {
    const change = {
      password: badUser.shortPassword
    }
    return fn.editTestUser(token, change)
      .then(res => {
        expect(res.status).to.be.equal(400);
      });
  });
  it("should return 400 if the email is in a bad format", () => {
    const change = {
      email: badUser.notemailformat
    }
    return fn.editTestUser(token, change)
      .then(res => {
        expect(res.status).to.be.equal(400);
      });
  });
  it("should return 400 if email field is empty", () => {
    change = {
      email: ''
    }
    return fn.editTestUser(token, change)
      .then(res => {
        expect(res.status).to.be.equal(400);
      });
  });
  it("should return 400 if password field is empty", () => {
    change = {
      password: ''
    }
    return fn.editTestUser(token, change)
      .then(res => {
        expect(res.status).to.be.equal(400);
      });
  });
  it("should return 400 if email field is empty", () => {
    change = {
      email: ''
    }
    return fn.editTestUser(token, change)
      .then(res => {
        expect(res.status).to.be.equal(400);
      });
  });
  it("should return 400 if password empty and username valid", () => {
    change = {
      email: testUser.update.email,
      password: ''
    }
    return fn.editTestUser(token, change)
      .then(res => {
        expect(res.status).to.be.equal(400);
      });
  });
  // Note, this should always be the last test in this describe
  // since we're not deleting the user with an after()
  it("should let a user delete itself", () => {
    expect(token).to.exist;
    return fn.deleteTestUser(token)
      .then(res => {
        expect(res.status).to.be.equal(200);
      });
  });
});