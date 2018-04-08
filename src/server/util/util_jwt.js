const jwt = require('jsonwebtoken');
const jwtconfig = require('../config/config_jwt');

const getTokenOptions = (req) => {
  // Token expires in 1 day
  const expiresIn = Math.floor(Date.now() / 1000) + (60 * 60 * 24);
  // Audience should be IP address of client
  const audience = req.ip;
  // Issuer is a way to identify this server
  // Could be spoofed, think about this
  const issuer = jwtconfig.issuer;
  // Subject is general API token
  const subject = "generalAPI"

  return {
    expiresIn: expiresIn,
    audience: audience,
    issuer: issuer,
    subject: subject
  };
}

/**
 * Generate an authentication token for a valid user
 */
const signToken = (req, user, next) => {
  const options = getTokenOptions(req);

  const payload = {
    id: user._id
  };

  // Sign and return the token
  jwt.sign(payload, jwtconfig.secret, options, (err, token) => {
    return next(err, token);
  });
}

const verifyToken = (req, next) => {
  if (!req.headers.authorization) {
    return next(new Error());
  }
  // Get signed token from authentication header
  const authHeader = req.headers.authorization.split(' ');
  const signedToken = authHeader.length > 1 ? authHeader[1] : "";
  
  const options = getTokenOptions(req);

  jwt.verify(signedToken, jwtconfig.secret, options, (error, decodedToken) => {
    return next(error, decodedToken);
  });
}

exports.signToken = signToken;
exports.verifyToken = verifyToken;