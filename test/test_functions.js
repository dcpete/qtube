const config = require('./test_config');
const dbconfig    = require('../src/server/config/config_database');
const server = require("supertest").agent(config.uri);
const models = require('../src/server/models');
const YoutubeVideo = require('../src/server/models/model_youtube_video');
const googleUtil = require('../src/server/util/util_google');

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

this.getChannels = (query, callback) => {
  return server
    .get(`/api/channels?${query}`)
    .end((err, res) => {
      return typeof callback === 'function' && callback(err, res);
    });
}

this.editChannel = (token, url, body, callback) => {
  return server
    .patch(url)
    .set("Authorization", "Bearer " + token)
    .send(body)
    .end((err, res) => {
      return typeof callback === 'function' && callback(err, res);
    })
}

this.createVideo = (youtubeid, callback) => {
  models.connect(dbconfig.uri);
  return googleUtil.getVideoById(youtubeid, (error, video) => {
    if (error) {
      return callback(error);
    }
    else {
      return YoutubeVideo.create(video, callback)
    }
  });
}

this.deleteVideo = (id, callback) => {
  models.connect(dbconfig.uri);
  return YoutubeVideo.delete(id, callback);
}

this.getVideo = (youtubeid, callback) => {
  models.connect(dbconfig.uri);
  return YoutubeVideo.getByYoutubeId(youtubeid, callback);
}