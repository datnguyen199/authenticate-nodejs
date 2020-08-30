const dbConfig = require('../config/db.config');
const config = require('../config/config');
const ROLE_USER = config.ROLES_USER;
const User = dbConfig.user;
const Role = dbConfig.role;

exports.checkDuplicateUserNameOrPassword = (req, res, next) => {
  User.findOne({ where: { username: req.body.username } })
  .then(user => {
    if(user) {
      res.status(401).send({ error: 'username is already taken' });
      return;
    }
    User.findOne({ where: { email: req.body.email } }).
    then(user => {
      if(user) {
        res.status(401).send({ error: 'email is already taken' });
        return;
      }

      next();
    })
  })
};

exports.checkRoleExist = (req, res, next) => {
  for(let i = 0; i < req.body.roles.length; i++) {
    if(!ROLE_USER.includes(req.body.roles[i].toLowerCase())) {
      res.status(401).send({ error: 'role is not valid' });
      return;
    }
  }

  next();
}
