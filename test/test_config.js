module.exports = {
  uri : 'http://localhost:3000',
  creds: {
    channels: {
      owner: {
        username: 'Test_Channel_Owner',
        password: 'this is my test channels password',
        email: 'testChannelOwner@test.org',
      },
      notOwner: {
        username: 'Test_Channel_Not_Owner',
        password: 'this is my test channels password',
        email: 'testchannelNotOwner@test.org'
      }
    },
    login: {
      username: 'Test_Login',
      password: 'this is my test user password',
      email: 'testlogin@test.org'
    },
    signup: {
      username: 'Test_Signup',
      password: 'this is my test signup password',
      email: 'testsignup@test.org'
    },
    users: {
      username: 'Test_Users',
      password: 'this is my test users password',
      email: 'testusers@test.org',
      update: {
        username: 'New_Test_Users',
        password: 'this is my new test users password',
        email: 'testusersnew@test.org'
      }
    },
    bad: {
      notemailformat: 'jimsemail',
      shortPassword: 'aaa',
      unknownEmail: 'notaknownemail@email.com',
      unknownUsername: 'notaknownuser',
      incorrectPassword: 'this is not my password'
    }
  }
}