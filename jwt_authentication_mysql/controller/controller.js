const db = require('../config/db.config');
const config = require('../config/config.js');
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

exports.signup = (req, res) => {
  User.create({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  }).then(user => {
    Role.findAll({
      where: {
        name: { [Op.or]: req.body.roles }
      }
    }).then(roles => {
      user.setRoles(roles).then(() => {
        res.status(200).send({ message: 'User registered successfully!'});
      }).catch(err => { res.status(500).send('error: ' + err) })
    })
  }).catch(err => { res.status(500).send('Error: ' + err) });
}
