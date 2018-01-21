const joi = require('joi');

const joiUser = joi.object({
  username: joi.string().min(1).max(16),
  password: joi.string().min(8),
  _id: joi.string().hex().length(24).required()
});

const joiUserSignup = joi.object({
  username: joi.string().min(1).max(16).required(),
  email: joi.string().min(1).email().required(),
  password: joi.string().min(8).required()
})

const joiUserLogin = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).required()
});

const joiUserEdit = joi.object({
  username: joi.string().min(1).max(16),
  password: joi.string().min(8),
  email: joi.string().min(1).email()
});

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

const joiChannelEdit = joi.object({
  action: joi.string().required(),
  payload: joi.object({
    name: joi.string(),
    youtubeId: joi.string().length(11)
  })
});

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
  channeEdit: joiChannelEdit,
  mongoId: joiMongoId
}