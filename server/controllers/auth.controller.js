const db = require("../models/index");
const config = require("../config/auth.config");
const User = db.user;
const UserPassword = db.userPassword;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  User.create({
    username: req.body.username,
    email: req.body.email,
    online: false
  })
    .then(user => {
      UserPassword.create({
        password: bcrypt.hashSync(req.body.password, 8),
        userId: user.id
      })
    })
    .then(userPassword => {
      res.status(201).send({ message: "User was registered successfully!" });
    })
    .catch(err => {
      res.status(500).send({ error: err.message });
    });
};

exports.signin = (req, res) => {
  var tmpUser = {};
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ error: "User Not found." });
      }
      tmpUser = user;
      UserPassword.findOne({
        where: {
          userId: user.dataValues.id
        }
      })
        .then(userPassword => {
          var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            userPassword.dataValues.password
          );

          if (!passwordIsValid) {
            return res.status(401).send({
              error: "Invalid Password!"
            });
          }

          var token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400 // 24 hours        
          });
          res.cookie('jwt', token, { maxAge: 9000000, httpOnly: true });
          res.status(200).send({ message: "Login successfully!", user: tmpUser });
        })
    })
    .catch(err => {
      res.status(500).send({ error: err.message });
    });
};

