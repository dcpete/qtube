const User = require('../models/model_user');
const verifyToken = require('../util/util_jwt').verifyToken;

/**
 *  Check the authentication token for a valid user
 */
const checkToken = (req, res, next) => {
  // GET shouldn't ever require authentication
  if (req.method == "GET") {
    return next();
  }
  verifyToken(req)
    .then(decodedToken => {
      return User.getUserById(decodedToken.uid);
    })
    .then(user => {
      req.user = user;
      return next();
    })
    .catch(err => {
      err.status = 401;
      return next(err);
    });
};

exports.checkToken = checkToken;