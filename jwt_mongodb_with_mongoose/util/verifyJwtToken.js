const jwt = require('jsonwebtoken');
const config = require('../config/mongodb.config');
const User = require('../model/user');
const Role = require('../model/role');

exports.verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'];

  if (!token){
    return res.status(403).send({
      message: 'No token provided!'
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err){
      return res.status(500).send({
        message: 'Fail to Authenticate'
      });
    }
    req.userId = decoded.id;
    next();
  });
}
