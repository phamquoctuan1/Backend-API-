const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.user;
const bcrypt = require('bcryptjs');

verifyToken = (req, res, next) => {
  const authHeader = String(req.headers['authorization'] || '');
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7, authHeader.length);
    if (!token) {
      return res.status(401).send({
        message: 'No token provided!',
      });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).send({
          message: 'Token không hợp lệ!',
        });
      }
      req.userInfo = decoded;
      next();
    });
  } else {
    res.status(403).json({ status: 'failed', message: 'Sai!' });
  }
};

isAdmin = (req, res, next) => {
  User.findByPk(req.userInfo.id)
    .then((user) => {
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === 'admin') {
            next();
            return;
          }
        }
        res.status(403).send({
          message: 'Require Admin Role!',
        });
        return;
      });
    })
    .catch((err) => {
      res.status(500).json({ err: err.message });
    });
};

isEmployee = (req, res, next) => {
  User.findByPk(req.userInfo.id)
    .then((user) => {
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === 'employee' || roles[i].name === 'admin') {
            next();
            return;
          }
        }
        res.status(403).send({
          message: 'Require Nhanvien1 Role!',
        });
      });
    })
    .catch((err) => {
      res.status(500).json({ err: err.message });
    });
};
isEmployeeOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        userName: req.body.userName,
        isEnabled: 1,
      },
    });
    if (!user) {
      return res.status(404).json({ message: 'Tài khoản không tồn tại.' });
    }
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(404).json({
        message: 'Mật khẩu không chính xác!',
      });
    }
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === 'employee') {
        req.user = user;
        next();
        return;
      }
      if (roles[i].name === 'admin') {
         req.user= user;
        next();
        return;
      }
      return res.status(404).json({
        message: 'Bạn không phải Admin, không quyền truy cập!',
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
      }
const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isEmployee: isEmployee,
  isEmployeeOrAdmin: isEmployeeOrAdmin,
};
module.exports = authJwt;
