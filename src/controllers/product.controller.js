const queryString = require('qs');
const db = require('../models');
const Op = db.Sequelize.Op;
const Product = db.product;
const { QueryTypes } = require('sequelize');
const Category = db.category;
const Image = db.image;
const Color = db.color;
const sequelize = db.sequelize;
const Size = db.size;
const Promote = db.promote;
const Brand = db.brand;
const OrderProduct = db.order_product;
const { getPaginationData } = require('../utils/pagination');
const { uploadMultipleFile, deleteAllFile } = require('../utils/upload');

exports.getAllProduct = async (req, res) => {
  try {
    const {
      _page,
      _limit,
      name,
      categoryId,
      color,
      size,
      _sort,
      _order,
      price,
    } = req.query;
    const LIMIT_PRODUCT = 24;
    const pageint = parseInt(_page);
    let limit = _limit ? parseInt(_limit) : LIMIT_PRODUCT;
    let offset = _page ? parseInt(_page - 1) * limit : null;
    const sort = _sort ? _sort : 'id';
    const order = _order ? _order : 'DESC';
    let conditionName = name ? { name: { [Op.like]: `%${name}%` } } : {};
    let conditionPrice = price
      ? { price: { [Op.between]: price } }
      : {};
    let condition = {
      ...conditionName,
      ...conditionPrice,
    };
    // let conditionCategory = category ? { slug: { [Op.in]: category } } : null;
    let conditionCategoryId = categoryId
      ? { id: { [Op.eq]: categoryId } }
      : null;
    let conditionColor = color ? { code: { [Op.in]: color } } : null;
    let conditionSize = size ? { name: { [Op.in]: size } } : null;

    const product = await Product.findAndCountAll({
      where: condition,
      attributes: [
        'id',
        'name',
        'price',
        'quantity',
        'description',
        'slug',
        'status',
        'createdBy',
        'categoryId',
        'discount_percentage',
      ],
      order: [[sort, order]],
      include: [
        {
          where: conditionCategoryId,
          model: Category,
          as: 'categoryInfo',
          attributes: ['id', 'slug', ['name', 'CategoryName']],
        },
        { model: Image, as: 'imageInfo', attributes: ['id', 'url'] },
        {
          where: conditionColor,
          model: Color,
          as: 'colorInfo',
          attributes: ['name', 'code'],
        },
        {
          where: conditionSize,
          model: Size,
          as: 'sizeInfo',
          attributes: ['name'],
        },
      ],
      distinct: true,
      offset,
      limit,
    });
    const data = getPaginationData(product.rows, product.count, pageint, limit);
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ status: 'failed', message: error.message });
  }
};
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      paranoid: false,
      attributes: [
        'id',
        'name',
        'price',
        'quantity',
        'description',
        'categoryId',
        'slug',
        'status',
        'createdBy',
        'discount_percentage',
      ],
      include: [
        // {
        //   model: Category,
        //   as: 'categoryInfo',
        //   attributes: ['id', 'slug', ['name', 'CategoryName']],
        // },
        { model: Image, as: 'imageInfo', attributes: ['url', 'publicId'] },
        {
          model: Color,
          as: 'colorInfo',
          attributes: ['name', 'code'],
        },
        {
          model: Size,
          as: 'sizeInfo',
          attributes: ['name'],
        },
      ],
    });
    res.status(200).json({ status: 'successed', data: product });
  } catch (error) {
    res.status(404).json({ status: 'failed', message: error.message });
  }
};
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { slug: req.params.slug },
      attributes: [
        'id',
        'name',
        'price',
        'quantity',
        'description',
        'slug',
        'status',
      ],
      paranoid: false,
      include: [
        { model: Image, as: 'imageInfo', attributes: ['url', 'publicId'] },
        {
          model: Color,
          as: 'colorInfo',
          attributes: ['name', 'code'],
        },
        {
          model: Size,
          as: 'sizeInfo',
          attributes: ['name'],
        },
      ],
    });
    res.status(200).json({ status: 'successed', data: product });
  } catch (error) {
    res.status(404).json({ status: 'failed', message: error.message });
  }
};
exports.getAmountProductByCategory = async (req, res) => {
  const categoryId = req.params.id;
  console.log(categoryId);
  try {
    const product = await Product.findAndCountAll({
      include: [
        {
          where: {
            id: categoryId,
          },
          model: Category,
          as: 'categoryInfo',
          attributes: ['slug', ['name', 'CategoryName']],
        },
      ],
      distinct: true,
    });
    res.status(200).json({ status: 'successed', data: product });
  } catch (error) {
    res.status(404).json({ status: 'failed', message: error.message });
  }
};
exports.createProduct = async (req, res) => {
  const t = await db.sequelize.transaction();

  const {
    name,
    price,
    quantity,
    description,
    discount_percentage,
    status,
    categoryId,
    imageInfo,
    sizeInfo,
    colorInfo,
  } = req.body;
  const prudoct = await Product.findOne({
    where: { name: { [Op.like]: `%${name}` } },
    transaction: t,
  });
  if (prudoct) {
    return res.status(400).json({
      message: 'Không được nhập trùng tên sản phẩm',
    });
  }
  try {
    const url = await uploadMultipleFile(imageInfo);
    let productData = {
      name: name,
      price: price,
      quantity: quantity,
      discount_percentage: discount_percentage,
      description: description,
      status: status,
      categoryId: categoryId,
      createdBy: req.userInfo.name,
      sizeInfo: sizeInfo.map((size) => ({
        name: size.name,
        ...{ productId: Product.id },
      })),
      colorInfo: colorInfo.map((color) => ({
        name: color.name,
        code: color.code,
        ...{ productId: Product.id },
      })),
      imageInfo: url.map((item) => ({
        url: item.secure_url,
        publicId: item.public_id,
        ...{
          imageableId: Product.id,
          imageableType: 'product',
          name: name,
        },
      })),
    };
    const newProduct = await Product.create(productData, {
      include: [
        { model: Image, as: 'imageInfo' },
        { model: Size, as: 'sizeInfo' },
        { model: Color, as: 'colorInfo' },
      ],
      transaction: t,
    });
    await t.commit();
    res.status(201).json({ status: 'Thành công' });
  } catch (error) {
    await t.rollback();
    res.status(500).send({ status: 'Thất bại', message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await OrderProduct.findOne({
      where: { productId: id },
    });
    if (product) {
      return res.status(400).send({ message: 'Không thể xóa sản phẩm này' });
    }
    const deletedProduct = await Product.destroy({
      where: { id: id },
    });
    res.status(202).json({ message: 'Thành công', data: deletedProduct });
  } catch (error) {
    res.status(500).json({ status: 'Thất bại', message: error.message });
  }
};
exports.restoreProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const restoredProduct = await Product.restore({
      where: { id: id },
    });
    res.status(202).json({ status: 'successed', data: restoredProduct });
  } catch (error) {
    res.status(500).json({ status: 'failed', message: error.message });
  }
};
exports.updateProduct = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { id } = req.params;
    const data = req.body;
    let sizeToUpdate = [];
    let colorToUpdate = [];
    let imagetoUpdate = [];
    if (data.sizeInfo.length > 0) {
      sizeToUpdate = data.sizeInfo.map((size) => ({
        name: size.name,
        ...{ productId: id },
      }));
      await Size.destroy({ where: { productId: id }, transaction: t });
    }

    if (data.colorInfo.length > 0) {
      colorToUpdate = data.colorInfo.map((color) => ({
        name: color.name,
        code: color.code,
        ...{ productId: id },
      }));
      await Color.destroy({ where: { productId: id }, transaction: t });
    }
    if (data.imageInfo.length > 0 && data.imageInfo[0].hasOwnProperty('url')) {
      imagetoUpdate = [];
    } else {
      const imageToDelete = await Image.findAll({
        where: { imageableId: id, imageableType: 'product' },
      });
      const public_idsToDelete = imageToDelete.map((item) => item['publicId']);
      await deleteAllFile(public_idsToDelete);
      await Image.destroy({
        where: { imageableId: id, imageableType: 'product' },
        transaction: t,
      });
      const url = await uploadMultipleFile(data.imageInfo);
      imagetoUpdate = url.map((image) => ({
        url: image.secure_url,
        publicId: image.public_id,
        ...{
          imageableId: id,
          imageableType: 'product',
          name: data.name,
        },
      }));
    }

    const sizeNew = await Size.bulkCreate(sizeToUpdate, { transaction: t });
    const colorNew = await Color.bulkCreate(colorToUpdate, { transaction: t });
    const imageNew = await Image.bulkCreate(imagetoUpdate, {
      transaction: t,
    });

    const productUpdated = await Product.update(data, {
      where: { id: id },
      transaction: t,
    });
    t.commit();
    res.status(200).json({ status: 'Thành Công' });
  } catch (error) {
    t.rollback();
    res.status(500).json({ status: 'Thất bại', message: error.message });
  }
};

exports.AnalyticsProduct = async (req, res) => {
  try {
    const topProducts = await sequelize.query(
      'SELECT productId,productName,count(*) as qty FROM `order_products` WHERE  createdAt BETWEEN LAST_DAY(curdate() - interval 1 month) + interval 1 day AND LAST_DAY(curdate()) group by productId ',
      {
        type: QueryTypes.SELECT,
      }
    );
    res.status(200).json(topProducts);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

exports.AnalyticsPrice = async (req, res) => {
  try {
    const MoMo = await sequelize.query(
      "SELECT SUM(amount) as amount ,orderType FROM `orders` WHERE orderType = 'MoMo'  AND  createdAt BETWEEN LAST_DAY(curdate() - interval 1 month) + interval 1 day AND LAST_DAY(curdate())",
      {
        type: QueryTypes.SELECT,
      }
    );
    const VNPay = await sequelize.query(
      "SELECT SUM(amount) as amount ,orderType FROM `orders` WHERE orderType = 'VNPay'  AND  createdAt BETWEEN LAST_DAY(curdate() - interval 1 month) + interval 1 day AND LAST_DAY(curdate())",
      {
        type: QueryTypes.SELECT,
      }
    );
    const Normal = await sequelize.query(
      "SELECT SUM(amount) as amount ,orderType FROM `orders` WHERE orderType = 'Normal'  AND  createdAt BETWEEN LAST_DAY(curdate() - interval 1 month) + interval 1 day AND LAST_DAY(curdate())",
      {
        type: QueryTypes.SELECT,
      }
    );
    const data = MoMo.concat(VNPay).concat(Normal);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error.message);
  }
};
