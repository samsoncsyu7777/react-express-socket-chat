const controller = require("../controllers/user.controller");
const authJwt = require("../middleware/authJwt");
const mySocket = require("../socket/mySocket");

module.exports = function (app) {

  app.get("/api/user/getallusers",
    [authJwt.verifyToken],
    controller.getAllUsers
  );

  app.post("/api/user/getdialog",
    [authJwt.verifyToken],
    controller.getDialog
  );

  app.post("/api/user/createmessage",
    [authJwt.verifyToken],
    controller.createMessage
  );

  app.post("/api/user/getallmessages",
    [authJwt.verifyToken],
    controller.getAllMessages
  );
  
  app.post("/api/user/setunreadzero",
    [authJwt.verifyToken],
    controller.setUnreadZero
  );
    
  app.post("/api/user/getfriendunread",
    [authJwt.verifyToken],
    controller.getFriendUnread
  );

  app.post("/api/user/saveimage",
    [authJwt.verifyToken],
    controller.saveImage
  );

  app.post("/api/user/savewelcome",
    [authJwt.verifyToken],
    controller.saveWelcome
  );

};
