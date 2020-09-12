const config = require('../config/mongodb.config');

const Role = require('../model/role');
const User = require('../model/user');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

exports.signUp = (req, res) => {
  const user = new User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  user.save(user => {
    Role.find({
      'name': { $in: req.body.roles.map(role => role.toLowerCase()) }
    }, (err, roles) => {
      if(err) return res.status(500).send({ message: `error ${err}` });
      user.roles = roles.map(role => role._id );
      user.save(err => {
        if(err) return res.status(500).send({ message: `error ${err}`})

        res.status(200).send({ message: 'User registered successfully!' });
      })
    })
  })
}
