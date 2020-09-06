module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define('comments', {
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          message: 'please enter comment'
        }
      }
    },
    confirmed: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  });

  return Comment;
}
