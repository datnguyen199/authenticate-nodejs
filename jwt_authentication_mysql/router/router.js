const validateSignUp = require('./validateSignUp');
const authJwt = require('./verifyJwtToken');

module.exports = function(app) {
  const controller = require('../controller/controller');
  app.post('/api/v1/signup', [validateSignUp.checkDuplicateUserNameOrPassword, validateSignUp.checkRoleExist], controller.signup);
  app.post('/api/v1/signin', controller.async_signin);
}
