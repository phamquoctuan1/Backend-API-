var jwt = require('jsonwebtoken');

exports.jwtCustom = {
  sign: function (obj, secret, time = '30m') {
    return jwt.sign(obj, secret, {
      expiresIn: time,
    });
  },

  verify: function (token, secret) {
    return new Promise(function (resolve, reject) {
      jwt.verify(token, secret, function (err, decode) {
        if (err) {
          reject(err);
          return;
        }
        resolve(decode);
      });
    });
  },
};
