const jwt = require('jsonwebtoken');
const config = require('../config/config');
const db = require('../config/db.config');
const Role = db.role;
const User = db.user;

exports.verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'];

  if(!token) {
    return res.status(401).send({
      auth: false,
      message: 'No access token provided'
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if(err) {
      res.status(401).send({
        auth: false,
        message: 'Fail to authentication'
      })
    }
    req.userId = decoded.id;
    next();
  })
}

exports.isAdmin = (req, res, next) => {
  User.findById(req.userId).then(user => {
    user.getRoles().then(roles => {
      for(let i = 0; i < roles.length; i++) {
        if(roles[i].name.toLowerCast === 'admin') {
          next();
          return;
        }
      }

      res.status(403).send('Require admin role');
      return;
    })
  })
}


exports.isAdminOrSuperAdmin = (req, res, next) => {
  User.findById(req.userId).then(user => {
    user.getRoles().then(roles => {
      for(let i = 0; i < roles.length; i++) {
        if(roles[i].name.toLowerCase === 'admin') {
          next();
          return;
        }

        if(roles[i].name.toLowerCase === 'super_admin') {
          next();
          return;
        }
      }

      res.status(403).send('Require admin or super admin role');
      return;
    })
  })
}
