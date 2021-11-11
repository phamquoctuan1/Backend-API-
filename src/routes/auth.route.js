const express = require('express');
const {
  Login,
  Register,
  RefreshToken,
  LoginGoogle,
  verifyUser,
  getUser,
  redirectToForgetPage,
  forgetUser,
  recoveryUser,
} = require('../controllers/auth.controller');
const verifySignUp = require('../middleware/verifyRegister');
const authJwt = require('../middleware/authJwt');

const router = express.Router();

router
  .get('/user', authJwt.verifyToken, getUser)
  .post('/login', Login)
  .post(
    '/register',
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    Register
  )
  .post('/google/login', LoginGoogle)
  .post('/refreshtoken', RefreshToken)
  .get('/verify/:token', verifyUser)
  .post('/forgetuser', forgetUser)
  .get('/password-reset/:id/:token', redirectToForgetPage)
  .post('/password-reset/:id/:token', recoveryUser);
module.exports = router;
