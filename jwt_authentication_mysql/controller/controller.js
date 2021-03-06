const db = require('../config/db.config');
const config = require('../config/config.js');
const User = db.user;
const Role = db.role;
const Post = db.post;
const Comment = db.comment;
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

exports.asyncSignup = async (req, res) => {
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

exports.asyncSignin = async (req, res) => {
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

exports.createPost = (req, res) => {
  Post.create({
    title: req.body.title,
    content: req.body.content,
    userId: req.userId
  }).then(post => {
    res.status(200).send(post);
  }).catch(err => {
    res.status(401).send({ message: err.message })
  });
}

exports.findPostById = async (req, res) => {
  try {
    const { id: postId } = req.params;
    console.log(postId);
    const post = await Post.findOne({
      where: { id: postId },
      include: [
        {
          model: User
        }, {
          model: Comment,
          include: [ {
              model: User
            }
          ]
        }
      ]
    });
    if(post) {
      return res.status(200).json({ post });
    }

    return res.status(404).send({ message: `cannot find post with id=${postId}` });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User
        },
        {
          model: Comment
        }
      ]
    });
    res.status(200).json(posts);
  } catch(err) {
    res.status(500).send({ message: err.message });
  }
}
