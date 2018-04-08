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
  password: {
    type: String,
    select: false
  }
});

UserSchema.plugin(uniqueValidator);

const createUser = function (email, username, password, callback) {
  const newUser = new this({
    email: email,
    username: username,
    password: hashPassword(password)
  });

  newUser.save(callback);
}

const deleteUser = function (id, callback) {
  this
    .findById(id)
    .exec((error, user) => {
      if (error || !user) {
        callback(new Error("Error querying for user"));
      }
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
    .exec(callback);
}

const getUserSensitiveInfo = function (email, callback) {
  this
    .findOne({ 'email': email })
    .select('+password')
    .exec(callback);
}

const updateUser = function (id, change, callback) {
  if (change.password) {
    change.password = hashPassword(change.password);
  }
  this
    .findByIdAndUpdate(id, { $set: change }, { new: true })
    .exec(callback);
}

UserSchema.statics.create = createUser;
UserSchema.statics.getByID = getUserByID;
UserSchema.statics.getUserByEmail = getUserByEmail;
UserSchema.statics.delete = deleteUser;
UserSchema.statics.edit = updateUser;
UserSchema.statics.getUserSensitiveInfo = getUserSensitiveInfo;

// Model method to check if password is correct
UserSchema.methods.comparePassword = function comparePassword(password, callback) {
  return bcrypt.compare(password, this.password, callback);
};

// Model method to hash the password
function hashPassword(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(bcryptConfig.numSaltRounds));
}

module.exports = mongoose.model('User', UserSchema);