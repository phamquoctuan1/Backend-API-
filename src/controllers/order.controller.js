const db = require('../models');
const { reduceArr } = require('../utils/common');
const { getPaginationData } = require('../utils/pagination');
const Op = db.Sequelize.Op;
const User = db.user;
const Order = db.order;
const OrderProduct = db.order_product;
const Shipment = db.shipment
const Product = db.product
const payOrderEmailTemplate = require('../utils/payOrderEmailTemplate');
const sendEmail = require('../utils/sendmail');
exports.getAllOrder = async (req, res) => {
  try {
      const {_page=1,_limit=6} = req.query
      const LIMIT_PRODUCT = 12;
      const pageint = parseInt(_page);
      let limit = _limit ? parseInt(_limit) : LIMIT_PRODUCT;
      let offset = _page ? parseInt(_page - 1) * limit : null;
    const order = await Shipment.findAndCountAll({
      include: [
        {
          model: Order,
          as: 'orderInfo',
          include: [
            {
              model: OrderProduct,
              as: 'OrderDetails',
            },
          ],
        },
      ],
      order: [['ship_date', 'DESC']],
      distinct: true,
      offset,
      limit,
    });
    const data = getPaginationData(order.rows, order.count, pageint, limit);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Thất bại', error: error.message });
  }
};

exports.updateOrder  = async (req, res) => { 
   try {
        const id = req.params.id;
        const order = await Order.findByPk(id, {
          include: [
            {
              model: OrderProduct,
              as: 'OrderDetails',
            },
            {
              model: Shipment,
              as: 'shipmentInfo',
            },
            { model: User, as: 'userInfo', attributes: ['email'] },
          ],
        });
        let subject = 'Thông báo xác nhận đơn hàng!';
        const html = payOrderEmailTemplate(order);
          await sendEmail(order.shipmentInfo.email, subject, html);
         const shipment = await Shipment.findOne({
           where: { orderId: req.params.id },
         });
        shipment.status = true;
        shipment.save();
        order.status = true;
        order.save();
        const orderDetails = await OrderProduct.findAll({
           where: { orderId: id },
           include: [
             {
               model: Product,
               as: 'productInfo',
               attributes: ['id', 'quantity'],
             },
           ],
         });
         const orderDetailsAfter = reduceArr(orderDetails);
         for (let i = 0; i < orderDetailsAfter.length; i++) {
           const product = await Product.findByPk(
             orderDetailsAfter[i].productId
           );
           product.quantity = product.quantity - orderDetailsAfter[i].quantity;
           if (product.quantity < 0) {
             return res
               .status(400)
               .json({
                 message: 'Không đủ số lượng trong kho',
               });
           }
           product.save();
         }
         ;
        res.status(200).json({ message: 'Thành công'})
   } catch (error) {
        res.status(500).json({ message: 'thất bại', error: error.message });
   }
};

exports.getOrderById = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findByPk(id,{include:[{all:true,nested:true}]});
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'thất bại', error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedOrder = await Order.destroy({
      where: { id: id },
    });
    const deletedShipment = await Shipment.destroy({
       where: { orderId: id },
     });
    res.status(202).json({ message: 'Thành công', data: deletedOrder });
  } catch (error) {
    res.status(500).json({ message: 'thất bại', error: error.message });
  }
};
exports.getDeletedOrder = async (req, res) => {
    try {

      const deletedShipment = await Shipment.findAll({
        where: { deletedAt: { [Op.not]: null } },
        include: [
          {
            model: Order,
            as: 'orderInfo',
            paranoid: false,
            include: [
              {
                model: OrderProduct,
                as: 'OrderDetails',
              },
            ],
          },
        ],
        paranoid: false,
      });
      res.status(202).json({ message: 'Thành công', data: deletedShipment });
    } catch (error) {
      res.status(500).json({ message: 'thất bại', error: error.message });
    }
}

exports.restoreOrder = async (req, res) => {
  try {
    
    const data1 = await Order.restore({
      where: { id:req.params.id },      
    });
  const data12 = await Shipment.restore({
    where: { orderId: req.params.id },
  });
    res.status(202).json({ message: 'Thành công'});
  } catch (error) {
    res.status(500).json({ message: 'thất bại', error: error.message });
  }
};