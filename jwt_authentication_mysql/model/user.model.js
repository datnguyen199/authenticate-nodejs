module.exports =  (sequelize, Sequelize) => {
  const User = sequelize.define('users', {
    name: {
      type: Sequelize.STRING
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    }
  })

  return User;
}
