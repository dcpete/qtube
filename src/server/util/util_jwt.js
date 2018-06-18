const promisify = require('bluebird').promisify;
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/config_jwt');
const jwtSign = promisify(jwt.sign);
const jwtVerify = promisify(jwt.verify);

const getTokenOptions = (req) => {
  // Token expires in 1 day
  const expiresIn = Math.floor(Date.now() / 1000) + (60 * 60 * 24);
  // Audience should be IP address of client
  const audience = req.ip;
  // Issuer is a way to identify this server
  // Could be spoofed, think about this
  const issuer = jwtConfig.issuer;
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
const signToken = (req) => {
  const { uid } = req.user;
  const options = getTokenOptions(req);
  const payload = { uid };
  return jwtSign(payload, jwtConfig.secret, options);
}

const verifyToken = (req) => {
  const authHeader = req.headers.authorization.split(' ');
  const signedToken = authHeader.length > 1 ? authHeader[1] : "";
  const options = getTokenOptions(req);
  return jwtVerify(signedToken, jwtConfig.secret, options);
}

exports.signToken = signToken;
exports.verifyToken = verifyToken;