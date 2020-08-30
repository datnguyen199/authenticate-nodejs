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

exports.async_signup = async (req, res) => {
  try {
    const user = await User.create({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8)
    });
    const roles = await Role.findAll({
      where: {
        name: { [Op.or]: req.body.roles }
      }
    })
    user.setRoles(roles);
    res.status(200).send({ message: 'User registered async successfully!' });
  } catch(err) {
    res.status(500).send('Error: ' + err)
  }
}

exports.signin = (req, res) => {
  if(!(req.body.username || req.body.password)) {
    res.status(401).send({ message: 'please enter username and password!' });
    return;
  }
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if(!user) { res.status(401).send({ message: 'username or password is wrong!' }) }

    var passwordValid = bcrypt.compareSync(req.body.password, user.password);
    if(!passwordValid) { res.status(401).send({ message: 'username or password is wrong!' }) }

    var token = jwt.sign({id: user.id }, config.secret, { expiresIn: 86400 });
    res.status(200).send({
      message: 'sign in sucessfully!',
      username: user.username,
      accessToken: token
    });
  });
}

exports.async_signin = async (req, res) => {
  if(!(req.body.username || req.body.password)) {
    res.status(401).send({ message: 'please enter username and password!' });
    return;
  }
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username
      }
    })
    if(!user) { res.status(401).send({ message: 'username or password is wrong!' }) }

    var passwordValid = bcrypt.compareSync(req.body.password, user.password);
    if(!passwordValid) { res.status(401).send({ message: 'username or password is wrong!' }) }

    var token = jwt.sign({id: user.id }, config.secret, { expiresIn: 86400 });
    res.status(200).send({
      message: 'sign in sucessfully!',
      username: user.username,
      accessToken: token
    });
  } catch(err) {
    res.status(500).send('Error: ' + err)
  }
}
