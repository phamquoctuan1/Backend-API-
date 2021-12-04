const db = require('../models');
const { getPaginationData } = require('../utils/pagination');
const Op = db.Sequelize.Op;
const User = db.user;
const Order = db.order;
const OrderProduct = db.order_product;
const Shipment = db.shipment
exports.getAllOrder = async (req, res) => {
  try {
      const {_page=1,_limit=6} = req.query
      const LIMIT_PRODUCT = 12;
      const pageint = parseInt(_page);
      let limit = _limit ? parseInt(_limit) : LIMIT_PRODUCT;
      let offset = _page ? parseInt(_page - 1) * limit : null;
    const order = await Order.findAndCountAll({
      include: [
        {
          model: OrderProduct,
          as: 'OrderDetails',
        },
        {
          model: User,
          as: 'userInfo',
        },
        {
          model: Shipment,
          as: 'shipmentInfo',
        },
      ],
      distinct: true,
      offset,
      limit,
    });
    const data = getPaginationData(order.rows, order.count, pageint, limit);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'thất bại', error: error.message });
  }
};

exports.updateOrder  = async (req, res) => {
  
   try {
        const id = req.params.id;
        const order = await Order.findByPk(id);
        order.status = true;
        order.save();
        res.status(200).json({ message: 'Thành công'})
   } catch (error) {
        res.status(500).json({ message: 'thất bại', error: error.message });
   }
};
