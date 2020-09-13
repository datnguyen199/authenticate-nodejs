const rootPath = require('path').resolve(__dirname, '..');
require('dotenv').config({path: rootPath + '/.env'});
const env = require('./env');
const Sequelize = require('sequelize');
const userModel = require('../model/user.model')
const roleModel = require('../model/role.model')
const postModel = require('../model/post.model');
const commentModel = require('../model/comment.model');

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.USER_NAME, process.env.PASSWORD, {
  host: process.env.HOST,
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
db.post = postModel(sequelize, Sequelize);
db.comment = commentModel(sequelize, Sequelize);
db.role.belongsToMany(db.user, { through: 'user_roles', foreignKey: 'roleId', otherKey: 'userId'});
db.user.belongsToMany(db.role, { through: 'user_roles', foreignKey: 'userId', otherKey: 'roleId'});
db.user.hasMany(db.post, { onDelete: 'CASCADE' });
db.user.hasMany(db.comment, { onDelete: 'CASCADE' });
db.post.belongsTo(db.user);
db.post.hasMany(db.comment, { onDelete: 'CASCADE' });
db.comment.belongsTo(db.post);
db.comment.belongsTo(db.user);

module.exports = db;
