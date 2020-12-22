const db = require("../models/index");
const User = db.user;

const checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        error: "Failed! Username is already in use!"
      });
      return;
    }

    // Email
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          error: "Failed! Email is already in use!"
        });
        return;
      }

      next();
    });
  });
};

const checkPasswordLength = (req, res, next) => {
  if (req.body.password.length < 6) {
    res.status(400).send({
      error: "Password needs at least 6 characters!"
    });
    return;
  }

  next();
}

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkPasswordLength: checkPasswordLength
};

module.exports = verifySignUp;
