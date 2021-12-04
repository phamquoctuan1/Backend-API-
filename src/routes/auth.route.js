const express = require('express');
const {
  Login,
  Register,
  RefreshToken,
  LoginGoogle,
  verifyUser,
  getUser,
  loginAdmin,
  forgetUser,
  recoveryUser,
} = require('../controllers/auth.controller');
const verifySignUp = require('../middleware/verifyRegister');
const authJwt = require('../middleware/authJwt');

const router = express.Router();

router
  .get('/user', authJwt.verifyToken, getUser)
  .post('/login', Login)
  .post('/admin/login', authJwt.isEmployeeOrAdmin, loginAdmin)
  .post(
    '/register',
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    Register
  )
  .post('/google/login', LoginGoogle)
  .post('/refreshtoken',authJwt.verifyToken, RefreshToken)
  .get('/verify/:id/:token', verifyUser)
  .post('/forgetuser', forgetUser)
  .post('/password-reset/:id/:token', recoveryUser);
module.exports = router;
