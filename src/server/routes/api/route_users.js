const User = require('../../models/model_user');
const _ = require('lodash');

/**
 * Get a specific user
 */
const getUserByUsername = (req, res, next) => {
  User.getUserByUsername(req.params.username)
    .then(user => {
      res.json(user);
    })
    .catch(next);
};

/**
 * Update user
 */
const editUser = (req, res, next) => {
  User.edit(req.user.uid, req.body)
    .then(user => {
      res.json(user);
    })
    .catch(next);
};

/**
 * Delete a user
 */
const deleteUser = (req, res, next) => {
  User.delete(req.user.uid)
    .then(user => {
      res.json(user);
    })
    .catch(next);
};

module.exports = {
  getUserByUsername,
  editUser,
  deleteUser
};