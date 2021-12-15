const { shipment } = require('../models');
const db = require('../models');
const User = db.user;
const sequelize = db.sequelize;
const Op = db.Sequelize.Op;
const OrderProduct = db.order_product;
const Order = db.order;
const { QueryTypes } = require('sequelize');
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



exports.AnalyticsPrice = async (req, res) => {
  try {
    const MoMo = await sequelize.query(
      "SELECT SUM(amount) as amount ,orderType FROM `orders` WHERE orderType = 'MoMo'  AND  createdAt BETWEEN LAST_DAY(curdate() - interval 1 month) + interval 1 day AND DATE_ADD(NOW(), INTERVAL 30 DAY)",
      {
        type: QueryTypes.SELECT,
      }
    );
     const VNPay = await sequelize.query(
       "SELECT SUM(amount) as amount ,orderType FROM `orders` WHERE orderType = 'VNPay'  AND  createdAt BETWEEN LAST_DAY(curdate() - interval 1 month) + interval 1 day AND DATE_ADD(NOW(), INTERVAL 30 DAY)",
       {
         type: QueryTypes.SELECT,
       }
     ); 
    const Normal = await sequelize.query(
      "SELECT SUM(amount) as amount ,orderType FROM `orders` WHERE orderType = 'Normal'  AND  createdAt BETWEEN LAST_DAY(curdate() - interval 1 month) + interval 1 day AND DATE_ADD(NOW(), INTERVAL 30 DAY)",
      {
        type: QueryTypes.SELECT,
      }
    );
    const data = MoMo.concat(VNPay).concat(Normal)
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error.message);
  }
};
