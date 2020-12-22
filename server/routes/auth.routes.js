const authJwt = require("../middleware/authJwt");
const verifySignUp = require("../middleware/verifySignUp");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkPasswordLength
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);
  
};

