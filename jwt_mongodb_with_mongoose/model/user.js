const Role = require('./role');
const mongoose = require('mongoose'), Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    validate: {
      validator: function(value) {
        let regrexEmail = /\S+@\S+\.\S+/;
        return regrexEmail.test(value);
      },
      message: props => `${props.value} is not a valid email`
    }
  },
  password: {
    type: String,
    required: true,
    min: 6
  },
  roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }]
});

module.exports = mongoose.model('User', UserSchema);
