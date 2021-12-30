const db = require('../models');
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
const OrderProduct =db.order_product
const { uploadFile } = require('../utils/upload');
const Order = db.order
const bcrypt = require('bcryptjs');

const Shipment = db.shipment
exports.getAllUser = async (req, res) => {
  try {
      const user = await User.findAll({
        where: {name : { [Op.ne]: `Admin`}},
        include: [
          {
            model: Order,
            as: 'orderInfo',
            include: [
              {
                model: Shipment,
                as: 'shipmentInfo',
              },
            ],
          },
        ],
      });
      res.status(200).json(user);
  } catch (error) {
     res
      .status(400)
      .json({ message: 'Không tìm thấy khách hàng', error: error.message });
  }
}
exports.getUserById = async (req, res) => {
  try {
     const {id} = req.params
    const user = await User.findByPk(id)
      res.status(200).json(user);
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Không tìm thấy khách hàng', error: error.message });
  }
  
}
exports.getOrderUser = async (req, res) => {
  try {
    const {id} = req.params
    const user = await User.findByPk(id, {
      attributes: ['name', 'phone', 'address'],
      include: [
        {
          model: Order,
          as: 'orderInfo',
          paranoid: false,
          attributes: ['id','name', 'amount', 'status', 'createdAt', 'orderType'],
        },
      ],
    });
    res.status(200).json(user);
  } catch (error) {
       res.status(400).json({ message: 'Không tìm thấy đơn hàng', error : error.message});
  }
}
exports.getOrderDetailUser = async (req, res) => {
  try {
    const { id } = req.params;
    const orderDetails = await OrderProduct.findAll({
      where: { orderId: id },
    });
    res.status(200).json(orderDetails);
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Không tìm thấy đơn hàng', error: error.message });
  }
};
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
      attributes: ['id','name', 'email', 'picture', 'phone', 'address'],
    });
    res
      .status(200)
      .json({ message: 'Cập nhật tài khoản thành công!', data: newUser });
  } catch (error) {
    res.status(500).json({ status: 'failed', message: error.message });
  }
};

exports.adminRestoreUser = async (req, res) => {
  try {
    
    const user = await User.findByPk(req.params.id);
    password = bcrypt.hashSync('123456789', 8);
    user.password = password
    user.save();
     res
       .status(200)
       .json({ message: 'Khôi phục tài khoản thành công!', data: user });
}catch (error) {
    res.status(500).json({ status: 'failed', message: error.message });
}
}
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
