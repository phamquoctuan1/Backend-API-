var jwt = require('jsonwebtoken');

exports.jwtCustom = {
  sign: function (obj, time = '2h') {
    return jwt.sign(obj, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: time,
    });
  },
  verify: function (token) {
    return new Promise(function (resolve, reject) {
      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        function (err, decode) {
          if (err) {
            reject(err);
            return;
          }
          resolve(decode);
        }
      );
    });
  },
};
