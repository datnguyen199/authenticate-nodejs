module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define('posts', {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [5, 200]
      }
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        customValidate(value) {
          if(value === null) {
            throw new Error('Content cannot be null!');
          }
        }
      }
    },
    confirmed: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0
    }
  });

  return Post;
}
