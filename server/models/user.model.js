module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    welcome: {
      type: Sequelize.STRING
    },
    online: {
      type: Sequelize.BOOLEAN
    },
    picture: {
      type: Sequelize.STRING(999999)
    }
  });

  return User;
};
