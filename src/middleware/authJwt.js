const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.user;

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
          message: 'Unauthorized!',
        });
      }
      req.userInfo = decoded;
      next();
    });
  } else {
    res.status(403).json({ status: 'failed', message: 'Unauthorized!' });
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

isEmployeeOrAdmin = (req, res, next) => {
  User.findByPk(req.userInfo.id)
    .then((user) => {
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === 'employee') {
            next();
            return;
          }

          if (roles[i].name === 'admin') {
            next();
            return;
          }
        }

        res.status(403).send({
          message: 'Require Employee or Admin Role!',
        });
      });
    })
    .catch((err) => {
      res.status(500).json({ err: err.message });
    });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isEmployee: isEmployee,
  isEmployeeOrAdmin: isEmployeeOrAdmin,
};
module.exports = authJwt;
