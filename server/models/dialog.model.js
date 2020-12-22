module.exports = (sequelize, Sequelize) => {
  const Dialog = sequelize.define("dialogs", {
    friends: {
      type: Sequelize.ARRAY(Sequelize.INTEGER)
    }
  });

  return Dialog;
};