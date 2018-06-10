const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt        = require('bcrypt');
const bcryptConfig  = require('../config/config_bcrypt');
const numSaltRounds = 8;
const _ = require('lodash');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    select: true,
    unique: true
  },
  email: {
    type: String,
    select: true,
    unique: true
  },
  password: {
    type: String,
    select: false
  }
});

UserSchema.plugin(uniqueValidator);
UserSchema.post('save', (error, doc, next) => {
  if (error.name === 'ValidationError') {
    const dupError = new Error('Property already exists');
    dupError.name = 'DuplicateEntryError';
    dupError.status = 409;
    const errs = {};
    _.each(error.errors, (error, index) => {
      switch (error.path) {
        case "username":
          errs.username = `Username has already been taken`;
        case "email":
          errs.email = 'This email has already been used to create an account';
      }
    })
    dupError.errors = errs;
    throw dupError;
  }
  else {
    next(error);
  }
})

const createUser = function (body) {
  const { email, username, password } = body;
  return hashPassword(password)
    .then(hash => {
      const newUser = new this({
        email: email,
        username: username,
        password: hash
      });
      return newUser.save();
    })
}

const deleteUser = function (id) {
  return this
    .findByIdAndDelete(id)
    .exec();
}

const getUserById = function (id) {
  return this
    .findById(id)
    .exec();
}

const getUserByUsername = function (username) {
  return this
    .findOne({username})
    .exec();
}

const getUserByEmail = function (email) {
  return this
    .findOne({ 'email': email })
    .exec();
}

const getUserSensitiveInfo = function (body) {
  return this
    .findOne(_.pick(body,['username', 'email']))
    .select('+password')
    .exec()
    .then(user => {
      if (!user) {
        const error = new Error("User not found");
        error.status = 401;
        throw error;
      }
      return user;
    });
}

const logInUser = function (body) {
  let user = undefined;
  return this.getUserSensitiveInfo(body)
    .then(returnedUser => {
      user = returnedUser;
      return comparePassword(body.password, user.password);
    })
    .then(isCorrectPassword => {
      if (!isCorrectPassword) {
        const error = new Error("Incorrect password");
        error.status = 401;
        throw error;
      }
      return user;
    });
}

const updateUser = function (username, change) {
  if (change.password) {
    change.password = hashPassword(change.password);
  }
  return this
    .findOneAndUpdate({ username }, { $set: change }, { new: true })
    .exec();
}

UserSchema.statics.createUser = createUser;
UserSchema.statics.getUserById = getUserById;
UserSchema.statics.getUserByUsername = getUserByUsername;
UserSchema.statics.getUserByEmail = getUserByEmail;
UserSchema.statics.delete = deleteUser;
UserSchema.statics.edit = updateUser;
UserSchema.statics.getUserSensitiveInfo = getUserSensitiveInfo;
UserSchema.statics.logInUser = logInUser;

// Model method to check if password is correct
const comparePassword = (plaintextPassword, hashedPassword) => {
  return bcrypt.compare(plaintextPassword, hashedPassword);
};

// Model method to hash the password
function hashPassword(password) {
  return bcrypt.genSalt(bcryptConfig.numSaltRounds)
    .then(salt => {
      return bcrypt.hash(password, salt)
    })
  //return bcrypt.hashSync(password, bcrypt.genSaltSync(bcryptConfig.numSaltRounds));
}

module.exports = mongoose.model('User', UserSchema);