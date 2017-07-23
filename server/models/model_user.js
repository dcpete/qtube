const mongoose    = require('mongoose');
const bcrypt      = require('bcrypt');

const numSaltRounds = 8;

const UserSchema = new mongoose.Schema({
  username: String,
  email: {
    type: String,
    index: { unique: true }
  },
  local: {
    password: String
  }
});

// Model method to check if password is correct
UserSchema.methods.comparePassword = function comparePassword(password, callback) {
  return bcrypt.compare(password, this.local.password, callback);
};

// Model method to hash the password
UserSchema.methods.hashPassword = function hashPassword(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(numSaltRounds));
}

module.exports = mongoose.model('User', UserSchema);