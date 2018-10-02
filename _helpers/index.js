const constants = require('../_constants/index.js')
const crypto = require('crypto');

module.exports = {
  // Middleware for verification
  verifyToken: function (req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerToken !== undefined) {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      req.token = bearerToken;
      next();
    } else {
      res.sendStatus(403);
    }
  },
  // Function for creating hash from password and secret
  createHash: function (pass) {
    let cipher = crypto.createCipher('aes-128-cbc', pass);
    let hash = cipher.update(constants.API_SECRET, 'utf8', 'hex')
    hash += cipher.final('hex');
    return hash;
  },
}
