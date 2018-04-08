const User = require('../../models/model_user');
const _ = require('lodash');

/**
 * Get a specific user
 */
const getUserById = (req, res, next) => {
  const userid = req.params.userid;
  User.getByID(userid, (error, user) => {
    if (error) {
      return res.status(500).json({
        message: 'Could not retrieve user'
      });
    }
    if (!user) {
      return res.status(404).json({
        message: 'Could not find user'
      });
    }
    res.json(user);
  });
};

/**
 * Update user
 */
const editUser = (req, res, next) => {
  User.edit(req.user._id, req.body, (error, user) => {
    if (error) {
      res.status(500).json({
        message: 'Could not edit user'
      });
    }
    else if (!user) {
      res.status(404).end;
    }
    else {
      res.json(user);
    }
  })
};

/**
 * Delete a user
 */
const deleteUser = (req, res, next) => {
  User.delete(req.user._id, (error, user) => {
    if (error) {
      res.status(500).json({
        message: 'Could not delete user'
      });
    }
    else if (!user) {
      res.status(404).end;
    }
    else {
      res.json(user);
    }
  });
};

module.exports = {
  getById: getUserById,
  edit: editUser,
  delete: deleteUser
};