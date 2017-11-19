const config = require('./test_config');
const server = require("supertest").agent(config.uri);

this.createTestUser = (email, username, password, callback) => {
  return server
    .post('/auth/signup')
    .send({
      'email': email,
      'username': username,
      'password': password
    })
    .type('form')
    .end((err, res) => {
      return typeof callback === 'function' && callback(err, res);
    });
}

this.getTestUser = (id, callback) => {
  const url = `/api/users/${id}`;
  return server
    .get(`/api/users/${id}`)
    .end((err, res) => {
      return typeof callback === 'function' && callback(err, res);
    });
}

this.deleteTestUser = (token, callback) => {
  return server
    .delete("/api/users")
    .set("Authorization", "Bearer " + token)
    .end((err, res) => {
      return typeof callback === 'function' && callback(err, res);
    });
}

this.logInTestUser = (email, password, callback) => {
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

this.editTestUser = (token, change, callback) => {
  return server
    .patch('/api/users')
    .set("Authorization", "Bearer " + token)
    .send(change)
    .type('form')
    .end((err, res) => {
      return typeof callback === 'function' && callback(err, res);
    })
}

this.createChannel = (token, title, callback) => {
  return server
    .post("/api/channels")
    .set("Authorization", "Bearer " + token)
    .send({ "name": title })
    .type('form')
    .end((err, res) => {
      return typeof callback === 'function' && callback(err, res);
    });
}

this.deleteChannel = (token, url, callback) => {
  return server
    .delete(url)
    .set("Authorization", "Bearer " + token)
    .end((err, res) => {
      return typeof callback === 'function' && callback(err, res);
    });
}

this.editChannel = (token, url, body, callback) => {
  return server
    .patch(url)
    .set("Authorization", "Bearer " + token)
    .send(body)
    .type('form')
    .end((err, res) => {
      return typeof callback === 'function' && callback(err, res);
    })
}
