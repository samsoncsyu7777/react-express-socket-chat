const config = require("../config/db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB,
  process.env.DBUSER,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: "postgres",
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.dialog = require("../models/dialog.model.js")(sequelize, Sequelize);
db.message = require("../models/message.model.js")(sequelize, Sequelize);
db.userPassword = require("../models/userPassword.model.js")(sequelize, Sequelize);
db.unread = require("../models/unread.model.js")(sequelize, Sequelize);

db.message.belongsTo(db.dialog);
db.message.belongsTo(db.user);
db.userPassword.belongsTo(db.user);
db.unread.belongsTo(db.user);
db.unread.belongsTo(db.dialog);

module.exports = db;
