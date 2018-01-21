const expect = require("chai").expect;

const testUser = require('./test_config').creds.users;
const badUser = require('./test_config').creds.bad;
const fn = require("./test_functions");

describe("USERS (not authenticated)", () => {
  let id = null;
  let token = null;

  before((done) => {
    fn.createTestUser(testUser.email, testUser.username, testUser.password, (err, res) => {
      token = res.body.token;
      id = res.body.user._id;
      done();
    });
  })
  it("should return public info about a given user", (done) => {
    fn.getTestUser(id, (err, res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body._id).to.exist;
      expect(res.body._id).to.equal(id);
      expect(res.body.username).to.exist;
      expect(res.body.username).to.equal(testUser.username);
      expect(res.body.password).to.not.exist;
      done();
    })
  });

  after((done) => {
    fn.deleteTestUser(token, (err, res) => {
      expect(res.status).to.be.equal(200);
      done();
    });
  })
});

describe("API - USER MANAGEMENT (authenticated)", () => {
  let id = null;
  let token = null;

// Even though it's not tested until later, we should create and delete users with every test.
// There shouldn't be any carryover, and tests should be able to run independently (even though
// functions might be needed).  

  before((done) => {
    fn.createTestUser(testUser.email, testUser.username, testUser.password, (err, res) => {
      id = res.body.user._id;
      token = res.body.token;
      done();
    });
  });

  it("should let a user change their username", (done) => {
    const change = {
      username: testUser.update.username
    }
    fn.editTestUser(token, change, (err, res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body).to.exist;
      expect(res.body.username).to.be.equal(change.username);
      // Change the username back to the original
      fn.editTestUser(token, { username: testUser.username }, (err, res) => {
        expect(res.status).to.be.equal(200);
        done();
      });
    });
  });
  it("should let a user change their password", (done) => {
    const change = {
      password: testUser.update.password
    }
    fn.editTestUser(token, change, (err, res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body).to.exist;
      // Test that the new password works for login
      fn.logInTestUser(testUser.email, change.password, (err, res) => {
        expect(res.status).to.be.equal(200);
        // Change the password back to the original
        fn.editTestUser(token, { password: testUser.password }, (err, res) => {
          expect(res.status).to.be.equal(200);
          done();
        })
      });
    });
  });
  it("should let a user change their email", (done) => {
    const change = {
      email: testUser.update.email
    }
    fn.editTestUser(token, change, (err, res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body).to.exist;
      expect(res.body.email).to.be.equal(change.email);
      // Test that the new email works for login
      fn.logInTestUser(change.email, testUser.password, (err, res) => {
        expect(res.status).to.be.equal(200);
        // Change the email back to the original
        fn.editTestUser(token, { email: testUser.email }, (err, res) => {
          expect(res.status).to.be.equal(200);
          done();
        });
      });
    });
  });
  it("should let a user change their email and password", (done) => {
    const change = {
      email: testUser.update.email,
      password: testUser.update.password
    }
    fn.editTestUser(token, change, (err, res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body).to.exist;
      expect(res.body.email).to.be.equal(change.email);
      fn.logInTestUser(change.email, change.password, (err, res) => {
        expect(res.status).to.be.equal(200);
        // Change password and email back to the original
        fn.editTestUser(token, { email: testUser.email, password: testUser.password }, (err, res) => {
          expect(res.status).to.be.equal(200);
          done();
        });
      });
    });
  });
  it("should return 200 if empty object is sent", (done) => {
    const change = {}
    fn.editTestUser(token, change, (err, res) => {
      expect(res.status).to.be.equal(200);
      expect(res.body.email).to.be.equal(testUser.email);
      expect(res.body.username).to.be.equal(testUser.username);
      done();
    });
  });
  it("should return 400 if an unknown parameter is specified", (done) => {
    const change = {
      unknownParam: 'something'
    }
    fn.editTestUser(token, change, (err, res) => {
      expect(res.status).to.be.equal(400);
      done();
    });
  });
  it("should return 400 if the password is too short", (done) => {
    const change = {
      password: badUser.shortPassword
    }
    fn.editTestUser(token, change, (err, res) => {
      expect(res.status).to.be.equal(400);
      done();
    });
  });
  it("should return 400 if the email is in a bad format", (done) => {
    const change = {
      email: badUser.notemailformat
    }
    fn.editTestUser(token, change, (err, res) => {
      expect(res.status).to.be.equal(400);
      done();
    });
  });
  it("should return 400 if email field is empty", (done) => {
    change = {
      email: ''
    }
    fn.editTestUser(token, change, (err, res) => {
      expect(res.status).to.be.equal(400);
      done();
    });
  });
  it("should return 400 if password field is empty", (done) => {
    change = {
      password: ''
    }
    fn.editTestUser(token, change, (err, res) => {
      expect(res.status).to.be.equal(400);
      done();
    });
  });
  it("should return 400 if email field is empty", (done) => {
    change = {
      email: ''
    }
    fn.editTestUser(token, change, (err, res) => {
      expect(res.status).to.be.equal(400);
      done();
    });
  });
  it("should return 400 if password empty and username valid", (done) => {
    change = {
      email: testUser.update.email,
      password: ''
    }
    fn.editTestUser(token, change, (err, res) => {
      expect(res.status).to.be.equal(400);
      done();
    });
  });
  // Note, this should always be the last test in this describe
  // since we're not deleting the user with an after()
  it("should let a user delete itself", (done) => {
    fn.deleteTestUser(token, (err, res) => {
      expect(res.status).to.be.equal(200);
      done();
    });
  });
});