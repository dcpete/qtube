const config = require('./test_config');
const dbconfig = require('../src/server/config/config_database');
const server = require("supertest").agent(config.uri);
const models = require('../src/server/models');
const YoutubeVideo = require('../src/server/models/model_youtube_video');
const googleUtil = require('../src/server/util/util_google');

this.createTestUser = (email, username, password) => {
  return server
    .post('/auth/signup')
    .send({
      'email': email,
      'username': username,
      'password': password
    })
    .type('form');
}

this.getTestUser = (username) => {
  const url = `/api/users/${usernamd}`;
  return server
    .get(`/api/users/${username}`);
}

this.deleteTestUser = (token) => {
  return server
    .delete("/api/users")
    .set("Authorization", "Bearer " + token);
}

this.logInTestUser = (email, password) => {
  return server
    .post('/auth/login')
    .send({
      'email': email,
      'password': password
    })
    .type('form');
}

this.editTestUser = (token, change) => {
  return server
    .patch('/api/users')
    .set("Authorization", "Bearer " + token)
    .send(change)
    .type('form');
}

this.createChannel = (token, title) => {
  return server
    .post("/api/channels")
    .set("Authorization", "Bearer " + token)
    .send({ "name": title })
    .type('form');
}

this.deleteChannel = (token, url) => {
  return server
    .delete(url)
    .set("Authorization", "Bearer " + token);
}

this.getChannels = (query) => {
  return server
    .get(`/api/channels?${query}`);
}

this.editChannel = (token, url, body) => {
  return server
    .patch(url)
    .set("Authorization", "Bearer " + token)
    .send(body);
}

this.createVideo = (youtubeid) => {
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

this.deleteVideo = (id) => {
  models.connect(dbconfig.uri);
  return YoutubeVideo.delete(id, callback);
}

this.getVideo = (youtubeid) => {
  models.connect(dbconfig.uri);
  return YoutubeVideo.getByYoutubeId(youtubeid, callback);
}