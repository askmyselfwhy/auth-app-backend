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
  //
  createHash: function (pass) {
    console.log(pass);
    console.log(constants.API_SECRET);
    let cipher = crypto.createCipher('aes-128-cbc', pass);
    let hash = cipher.update(constants.API_SECRET, 'utf8', 'hex')
    hash += cipher.final('hex');
    return hash;
  },
  verifySignInInputs: function (req, res, next) {
    if (first_name && last_name && email &&
      password1 && password2 && (password1 === password2)) {

    }
  }
}
