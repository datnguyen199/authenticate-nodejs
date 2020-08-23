const env = require('./env');
const Sequelize = require('sequelize');
const userModel = require('../model/user.model')
const roleModel = require('../model/role.model')

const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,

  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle
  }
});

// test connection
// const test = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('connect to db successfully!')
//   } catch (err) {
//     console.error('cannot connect db', err);
//   }
// }
// test();

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = userModel(sequelize, Sequelize);
db.role = roleModel(sequelize, Sequelize);
db.role.belongsToMany(db.user, { through: 'user_roles', foreignKey: 'roleId', otherKey: 'userId'});
db.user.belongsToMany(db.role, { through: 'user_roles', foreignKey: 'userId', otherKey: 'roleId'});

module.exports = db;
