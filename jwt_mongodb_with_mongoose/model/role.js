const mongoose = require('mongoose');

const RoleSchema = mongoose.Schema({
  name: String,
  required: [true, 'please enter name of role'],
  enum: ['user', 'admin', 'super_admin']
});

module.exports = mongoose.model('Role', RoleSchema);
