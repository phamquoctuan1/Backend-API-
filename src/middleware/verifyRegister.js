const db = require('../models');
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {

   if (req.body.password.length < 8) {
     res.status(400).send({
       message: 'Mật khẩu phải trên 8 ký tự',
     });
     return;
   }
  // Username
  User.findOne({
    where: {
      username: req.body.userName,
    },
  }).then((user) => {
    if (user) {
      res.status(400).json({
        message: 'Tên đăng nhập đã có người sử dụng!',
      });
      return;
    }

    // Email
    User.findOne({
      where: {
        email: req.body.email,
      },
    }).then((user) => {
      if (user) {
        res.status(400).send({
          message: 'Email đã có người sử dụng',
        });
        return;
      }
     
      next();
    });
  });
};
checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: 'Failed! Role does not exist = ' + req.body.roles[i],
        });
        return;
      }
    }
  }
  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted,
};

module.exports = verifySignUp;
