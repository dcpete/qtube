const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt        = require('bcrypt');
const bcryptConfig  = require('../config/config_bcrypt');
const numSaltRounds = 8;
const _ = require('lodash');
const shajs = require('sha.js');

const schema = new mongoose.Schema({
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
  },
  uid: {
    type: String,
    select: true,
    unique: true
  }
});

schema.plugin(uniqueValidator);
schema.post('save', (error, doc, next) => {
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
schema.post('save', (doc) => {
  if (!doc.uid) {
    doc.uid = shajs('sha256')
      .update(doc._id.toString())
      .digest('hex')
      .substring(0, 24);
    doc
      .update({ 'uid': doc.uid })
      .exec();
  }
})
schema.set('toJSON', {
  versionKey: false,
  transform: (doc, ret) => {
    ret.password && delete ret.password;
    delete ret._id;
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

const deleteUser = function (uid) {
  return this
    .findOneAndDelete({ uid: uid })
    .exec();
}

const getUserById = function (uid) {
  return this
    .findOne({ 'uid': uid })
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
    .findOne(_.pick(body,['username', 'email', 'uid']))
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

const updateUser = function (userId, change) {
  if (change.password) {
    return hashPassword(change.password)
      .then(hashedPassword => {
        const newChange = Object.assign(change, { password: hashedPassword });
        return this
          .findOneAndUpdate(
            { uid: userId },
            { $set: newChange },
            { new: true }
          )
          .exec();
      });
  }
  return this
    .findOneAndUpdate(
      { uid: userId },
      { $set: change },
      { new: true }
    )
    .exec();
}

schema.statics.createUser = createUser;
schema.statics.getUserById = getUserById;
schema.statics.getUserByUsername = getUserByUsername;
schema.statics.getUserByEmail = getUserByEmail;
schema.statics.delete = deleteUser;
schema.statics.edit = updateUser;
schema.statics.getUserSensitiveInfo = getUserSensitiveInfo;
schema.statics.logInUser = logInUser;

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
}

module.exports = mongoose.model('User', schema);