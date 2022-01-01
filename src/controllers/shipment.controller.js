
const db = require('../models');
const User = db.user;
const sequelize = db.sequelize;
const Op = db.Sequelize.Op;
const OrderProduct = db.order_product;
const Order = db.order;
const { QueryTypes } = require('sequelize');
const createInvoice = require('../utils/invoicePDF');
const sendMailPDF = require('../utils/sendMailPDF');
const { getPaginationData } = require('../utils/pagination');
const Shipment = db.shipment;


exports.getAllShipment = async (req, res) => {
  try {
    const { _page = 1, _limit = 6 } = req.query;
    const LIMIT_PRODUCT = 12;
    const pageint = parseInt(_page);
    let limit = _limit ? parseInt(_limit) : LIMIT_PRODUCT;
    let offset = _page ? parseInt(_page - 1) * limit : null;
    const shipment = await Shipment.findAndCountAll({
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
    const data = getPaginationData(
      shipment.rows,
      shipment.count,
      pageint,
      limit
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Thất bại', error: error.message });
  }
};
exports.updateShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findByPk(req.params.id,
      {
        include: [
          {
            model: Order,
            as: 'orderInfo',
            include: [
              {
                model: OrderProduct,
                as: 'OrderDetails',
              },
              {
                model: User,
                as: 'userInfo',
              },
            ],
          },
        ],
      }
    );
    const order = await Order.findByPk(shipment.orderInfo.id, {
      include: [
        {
          model: OrderProduct,
          as: 'OrderDetails',
        },
        {
          model: Shipment,
          as: 'shipmentInfo',
        },
      ],
    });
    shipment.status = 'Đã giao thành công';
    shipment.save(); 
    order.status = 'Đã giao';
    order.save();
    let subject = `Đơn hàng ${order.name} đã được giao thành công`;
    const html = `<h3>Xin chào ${shipment.name_customer} </h3> <br/> <h3>
        Đơn hàng của bạn đã được hoàn tất. Chúng tôi gửi một hóa đơn điện tử đến hộp thử xin kiểm tra<h3/>        
        <br/>
        `;
    createInvoice(order);
    await sendMailPDF(shipment.email, subject, html);
    res.status(200).json(order);
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Xảy ra lỗi thử lại sau', error: error.message });
  }
};


exports.cancelShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findByPk(req.params.id, {
      include: [
        {
          model: Order,
          as: 'orderInfo',
          include: [
            {
              model: OrderProduct,
              as: 'OrderDetails',
            },
            {
              model: User,
              as: 'userInfo',
            },
          ],
        },
      ],
    });
    const order = await Order.findByPk(shipment.orderInfo.id, {
      include: [
        {
          model: OrderProduct,
          as: 'OrderDetails',
        },
        {
          model: Shipment,
          as: 'shipmentInfo',
        },
      ],
    });
    shipment.status = 'Giao hàng không thành công';
    shipment.save();
    order.status = 'Đơn hàng giao không thành công';
    order.save();
    res.status(200).json(order);
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Xảy ra lỗi thử lại sau', error: error.message });
  }
};
