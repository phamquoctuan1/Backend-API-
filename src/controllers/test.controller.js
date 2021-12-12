const { shipment } = require('../models');
const db = require('../models');
const User = db.user;
const Op = db.Sequelize.Op;
const OrderProduct = db.order_product;
const Order = db.order;

const Shipment = db.shipment;
exports.getAll = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderProduct,
          as: 'OrderDetails',
        },
        {
          model: shipment,
          as: 'shipmentInfo',
        },
        { model: User, as: 'userInfo',attributes:['email'] },
      ],
    });
    res.status(200).json(order);
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Không tìm thấy khách hàng', error: error.message });
  }
};
