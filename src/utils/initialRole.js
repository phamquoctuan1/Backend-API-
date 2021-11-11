const db = require('../models/');
const Role = db.role;

exports.initialRole = () => {
  Role.create({
    id: 1,
    name: 'user',
  });

  Role.create({
    id: 2,
    name: 'admin',
  });

  Role.create({
    id: 3,
    name: 'employee',
  });
};
