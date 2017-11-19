const User        = require('../models/model_user');
const jwtutil     = require('../util/util_jwt');

/**
 *  Check the authentication token for a valid user
 */
const checkToken = (req, res, next) => {
  // GET shouldn't ever require authentication
  if (req.method == "GET") {
    return next();
  }

  // Verify that the token is valid
  jwtutil.verifyToken(req, (error, decodedToken) => {
    // If error verifying token, return 401
    if (error || !decodedToken) {
      return res.status(401).send(error);
    }
    else {
      // Check if the user exists
      const userId = decodedToken.id;
      User.getByID(userId, (error, user) => {
        if (error || !user) {
          error = new Error("Error retrieving user");
          error.name = 'DatabaseError';
          return res.status(500).send(error);
        }
        else {
          req.user = user;
        }
        return next();
      });
    }
  });
};

exports.checkToken = checkToken;