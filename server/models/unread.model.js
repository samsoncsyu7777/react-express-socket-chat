module.exports = (sequelize, Sequelize) => {
  const Unread = sequelize.define("unreads", {
    value: {
      type: Sequelize.INTEGER
    },
    friendId: {
      type: Sequelize.INTEGER
    }
  });

  return Unread;
};