module.exports = (sequelize, Sequelize) => {
  const Message = sequelize.define("messages", {
    messageString: {
      type: Sequelize.STRING(999999)
    }
  });

  return Message;
};