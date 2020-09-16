const mongoose = require('mongoose');

const RoleSchema = mongoose.Schema({
  name: String,
  enum: ['user', 'admin', 'super_admin']
});

module.exports = mongoose.model('Role', RoleSchema);
