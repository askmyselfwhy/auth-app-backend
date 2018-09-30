
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
  verifySignInInputs: function (req, res, next) {
    if (first_name && last_name && email &&
      password1 && password2 && (password1 === password2)) {

    }
  }
}
