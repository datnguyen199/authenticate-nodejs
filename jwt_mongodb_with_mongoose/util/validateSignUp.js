const config = require('../config/mongodb.config');
const ROLES = config.ROLES;
const User = require('../model/user');

exports.checkDuplicateUserNameOrEmail = (req, res, next) => {
  User.findOne({ username: req.body.username })
  .exec((err, user) => {
    if(err) return res.status(500).send({
      message: 'Error to validate!'
    })

    if(user) {
      return res.status(401).send({
        message: 'Username is already taken!'
      })
    }
  })

  User.findOne({ email: req.body.email })
  .exec((err, user) => {
    if(err) return res.status(500).send({
      message: 'Error to validate'
    })

    if(user) {
      res.status(401).send({
        message: 'Email is already taken!'
      })
    }
  })

  next();
}

exports.checkRolesExisted = (req, res, next) => {
  for(let i = 0; i < req.body.roles.length; i++){
    if(!ROLES.includes(req.body.roles[i].toLowerCase())){
      res.status(400).send( { message: "Does NOT exist Role = " + req.body.roles[i] });
      return;
    }
  }

  next();
}
