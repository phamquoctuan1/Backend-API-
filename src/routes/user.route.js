const express = require('express');
const authJwt = require('../middleware/authJwt');
const {
  allAccess,
  userBoard,
  moderatorBoard,
  adminBoard,
  updateUser,
} = require('../controllers/user.controller');
const router = express.Router();

router.patch('/update', updateUser);
router.get('/all', allAccess);

router.get('/', [authJwt.verifyToken], userBoard);

router.get('/mod', [authJwt.verifyToken, authJwt.isEmployee], moderatorBoard);

router.get('/admin', [authJwt.verifyToken, authJwt.isAdmin], adminBoard);

module.exports = router;
