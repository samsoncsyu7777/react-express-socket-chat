const db = require("../models/index");

const User = db.user;
const Dialog = db.dialog;
const Message = db.message;
const Unread = db.unread;

exports.getAllUsers = (req, res) => {
  var sortArray = ["id", "asc"];
  var usersArray = [];
  if (req.query.sort) {
    sortArray = req.query.sort.split(":");
    if (!["id", "createdAt", "updatedAt"].includes(sortArray[0])
      || !["asc", "desc"].includes(sortArray[1])) {
      res.status(400).send({ error: "sort=id:asc or desc" });
    }
  }
  User.findAndCountAll({
    offset: req.query.page ? req.query.page * req.query.limit : 0,
    limit: req.query.limit ? req.query.limit : 100,
    order: [
      ["id", sortArray[1]]
    ]
  })
    .then(users => {
      usersArray = users;
      Unread.findAndCountAll({
        offset: req.query.page ? req.query.page * req.query.limit : 0,
        limit: req.query.limit ? req.query.limit : 100,
        order: [
          ["friendId", sortArray[1]]
        ],
        where: { userId: req.userId }
      })
        .then(unreads => {
          res.send({ users: usersArray, unreads: unreads });
        })
    })
    .catch(err => {
      res.status(500).send({ error: err.message });
    });
}

exports.getDialog = (req, res) => {
  Dialog.findOne({
    where: {
      friends: req.body.userIdArray
    }
  })
    .then(dialog => {
      if (dialog) {
        res.send({ dialog: dialog });
      } else {
        var unread = [];
        for (i = 0; i < req.body.userIdArray.length; i++) {
          unread.push(0);
        }
        Dialog.create({
          friends: req.body.userIdArray
        })
          .then(dialog => {
            res.send({ dialog: dialog });
            Unread.create({
              value: 0,
              userId: req.body.userIdArray[0],
              friendId: req.body.userIdArray[1],
              dialogId: dialog.id
            });
            Unread.create({
              value: 0,
              userId: req.body.userIdArray[1],
              friendId: req.body.userIdArray[0],
              dialogId: dialog.id
            });
          })
          .catch(err => {
            res.status(500).send({ error: err.message });
          });
      }
    })
    .catch(err => {
      res.status(500).send({ error: err.message });
    });
}

exports.createMessage = (req, res) => {
  Message.create({
    messageString: req.body.messageString,
    userId: req.userId,
    dialogId: req.body.dialogId
  })
    .catch(err => {
      res.status(500).send({ error: err.message });
    });
}

exports.getAllMessages = (req, res) => {
  var sortArray = ["updatedAt", "asc"];
  if (req.query.sort) {
    sortArray = req.query.sort.split(":");
    if (!["id", "messageString", "createdAt", "updatedAt", "dialogId", "userId"].includes(sortArray[0])
      || !["asc", "desc"].includes(sortArray[1])) {
      res.status(400).send({ error: "sort=id, messageString, createdAt, updatedAt, dialogId or userId:asc or desc" });
    }
  }
  Message.findAndCountAll({
    offset: req.query.page ? req.query.page * req.query.limit : 0,
    limit: req.query.limit ? req.query.limit : 100,
    where: { dialogId: req.body.dialogId },
    order: [
      [sortArray[0], sortArray[1]]
    ]
  })
    .then(messages => {
      res.send({ messages: messages });
    })
    .catch(err => {
      res.status(500).send({ error: err.message });
    });
}

exports.setUnreadZero = (req, res) => {
  Unread.update(
    { value: 0 },
    {
      where: { userId: req.userId, dialogId: req.body.dialogId }
    }
  )
    .then(unread => {
      res.status(200).send({ message: "Set unread to 0 successfully!" });
    })
    .catch(err => {
      res.status(500).send({ error: err.message });
    });
}

exports.getFriendUnread = (req, res) => {
  Unread.findOne({
    where: { friendId: req.userId, dialogId: req.body.dialogId }
  })
    .then(unread => {
      res.status(200).send({ friendUnread: unread.value });
    })
    .catch(err => {
      res.status(500).send({ error: err.message });
    });
}

exports.saveImage = (req, res) => {
  User.findOne({
    where: {
      id: req.userId
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ error: "User Not found." });
      }
      User.update(
        { picture: req.body.picture },
        {
          where: { id: req.userId }
        })
        .then(function (user) {
        });
      res.status(200).send({ message: "Save image successfully!" });
    })
    .catch(err => {
      res.status(500).send({ error: err.message });
    });
}

exports.saveWelcome = (req, res) => {
  User.findOne({
    where: {
      id: req.userId
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ error: "User Not found." });
      }
      User.update(
        { welcome: req.body.welcome },
        {
          where: { id: req.userId }
        })
        .then(function (user) {
        });
      res.status(200).send({ message: "Save welcome successfully!" });
    })
    .catch(err => {
      res.status(500).send({ error: err.message });
    });
}