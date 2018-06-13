const joi = require('joi');

const joiUser = joi.object({
  username: joi.string().min(1).max(16).regex(/^[A-Za-z0-9_]+$/),
  password: joi.string().min(8)
});

const joiUserSignup = joi.object({
  username: joi.string().min(1).max(16).regex(/^[A-Za-z0-9_]+$/).required(),
  email: joi.string().min(1).email().required(),
  password: joi.string().min(8).required()
})

const joiUserLogin = joi.object({
  email: joi.string().email(),
  username: joi.string().max(16).regex(/^[A-Za-z0-9_]+$/),
  password: joi.string().min(8).required()
}).xor('username', 'email');

const joiUserEdit = joi.object({
  username: joi.string().min(1).max(16).regex(/^[A-Za-z0-9_]+$/),
  password: joi.string().min(8),
  email: joi.string().min(1).email()
}).or('username', 'password', 'email');

const joiYoutubeVideo = joi.object({
  id: joi.string().length(11).required()
})

const joiPlaylist = joi.array().items({
  added: joi.date(),
  playcount: joi.number(),
  video: joiYoutubeVideo
});

const joiChannel = joi.object({
  name: joi.string().min(1).max(50),
  _id: joi.string().length(24).hex(),
  created: joi.date(),
  owner: joiUser,
  playlist: joiPlaylist,
  currentVideo: joiYoutubeVideo,
  currentVideoStarted: joi.date(),
  playing: joi.boolean()
});

const joiChannelCreate = joi.object({
  name: joi.string().min(1).max(50).required()
})

const joiChannelEdit = joi.object({
  name: joi.string().min(1).max(50),
  owner: joi.string().min(1).max(16)
}).or('name', 'owner');

const joiMongoId = joi.object().keys({
  _id: joi.string().length(24).hex()
});

module.exports = {
  user: joiUser,
  userEdit: joiUserEdit,
  userSignup: joiUserSignup,
  userLogin: joiUserLogin,
  youtubeVideo: joiYoutubeVideo,
  playlist: joiPlaylist,
  channel: joiChannel,
  channelCreate: joiChannelCreate,
  channeEdit: joiChannelEdit,
  mongoId: joiMongoId
}