const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt        = require('bcrypt');
const bcryptConfig  = require('../config/config_bcrypt');
const numSaltRounds = 8;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  local: {
    password: String
  }
});

UserSchema.plugin(uniqueValidator);

const createUser = function (email, username, password, callback) {
  const newUser = new this({
    email: email,
    username: username,
    local: {
      password: hashPassword(password)
    }
  });

  newUser.save(callback);
}

const deleteUser = function (id, callback) {
  this
    .findById(id)
    .exec((error, user) => {
      // Return 500 for error querying channel
      if (error || !user) {
        callback(new Error("Error querying for user"));
      }
      // Try to delete channel  
      else {
        user.remove(callback);
      }
  });
}

const getUserByID = function (id, callback) {
  this
    .findById(id)
    .exec(callback);
}

const getUserByEmail = function (email, callback) {
  this
    .findOne({ 'email': email })
    .exec(callback)
}

UserSchema.statics.create = createUser;
UserSchema.statics.getByID = getUserByID;
UserSchema.statics.getUserByEmail = getUserByEmail;
UserSchema.statics.delete = deleteUser;

// Model method to check if password is correct
UserSchema.methods.comparePassword = function comparePassword(password, callback) {
  return bcrypt.compare(password, this.local.password, callback);
};

// Model method to hash the password
function hashPassword(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(bcryptConfig.numSaltRounds));
}

module.exports = mongoose.model('User', UserSchema);