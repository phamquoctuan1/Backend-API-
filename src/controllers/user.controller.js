const db = require('../models');
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
const { uploadFile } = require('../utils/upload');
const bcrypt = require('bcryptjs');

exports.updateUser = async (req, res) => {
  try {
    let userUpdate = req.body;
    if (userUpdate.picture) {
      userUpdate.picture = await uploadFile(userUpdate.picture);
    }
    if (userUpdate.password) {
      userUpdate.password = bcrypt.hashSync(userUpdate.password, 8);
    }
    const user = await User.update(userUpdate, {
      where: { id: userUpdate.id },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: 'Cập nhật tài khoản không thành công!' });
    }
    const newUser = await User.findOne({
      where: { id: userUpdate.id },
      attributes: ['name', 'email', 'picture', 'phone', 'address'],
    });
    res
      .status(200)
      .json({ message: 'Cập nhật tài khoản thành công!', data: newUser });
  } catch (error) {
    res.status(500).json({ status: 'failed', message: error.message });
  }
};
exports.allAccess = (req, res) => {
  res.status(200).json('Public Content.');
};
exports.userBoard = (req, res) => {
  res.status(200).json('User Content.');
};

exports.adminBoard = (req, res) => {
  res.status(200).json('Admin Content.');
};

exports.moderatorBoard = (req, res) => {
  res.status(200).json('Moderator Content.');
};
