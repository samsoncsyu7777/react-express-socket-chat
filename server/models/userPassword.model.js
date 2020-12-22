module.exports = (sequelize, Sequelize) => {
  const UserPassword = sequelize.define("userpasswords", {
    password: {
      type: Sequelize.STRING
    }
  });

  return UserPassword;
};