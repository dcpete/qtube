const config = require('./test_config');
const server = require("supertest").agent(config.uri);
const YoutubeVideo = require('../src/server/models/model_youtube_video');

this.createTestUser = (credentials) => {
  return server
    .post('/auth/signup')
    .send(credentials)
    .type('form');
}

this.getTestUser = (username) => {
  return server
    .get(`/api/users/${username}`);
}

this.deleteTestUser = (token) => {
  return server
    .delete("/api/users")
    .set("Authorization", "Bearer " + token);
}

this.logInTestUser = (credentials) => {
  return server
    .post('/auth/login')
    .send(credentials)
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
  return YoutubeVideo.create(youtubeid);
}

this.deleteVideo = (id) => {
  return YoutubeVideo.delete(id);
}

this.getVideo = (youtubeid) => {
  return YoutubeVideo.getByYoutubeId(youtubeid);
}