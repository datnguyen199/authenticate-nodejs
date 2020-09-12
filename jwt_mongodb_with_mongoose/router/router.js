const validateSignUp = require('../util/validateSignUp');
const authJwt = require('../util/verifyJwtToken');
const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');

router.post('/api/v1/signup',
    [validateSignUp.checkDuplicateUserNameOrEmail, validateSignUp.checkRolesExisted], controller.signUp);

module.exports = router;
