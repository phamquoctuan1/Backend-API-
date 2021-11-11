const db = require('../models');
const Op = db.Sequelize.Op;
const Product = db.product;
const Category = db.category;
const Image = db.image;
const Color = db.color;
const Size = db.size;
const Brand = db.brand;
const { getPaginationData, getPagination } = require('../utils/pagination');
const { uploadMultipleFile } = require('../utils/upload');

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
      pricegte,
      pricelte,
    } = req.query;
    const sort = _sort ? _sort : 'id';
    const order = _order ? _order : 'ASC';
    let conditionName = name ? { name: { [Op.like]: `%${name}%` } } : {};
    let conditionPriceGte = pricegte ? { price: { [Op.gte]: pricegte } } : {};
    let conditionPriceLte = pricelte ? { price: { [Op.lte]: pricelte } } : {};
    let condition = {
      ...conditionName,
      ...conditionPriceGte,
      ...conditionPriceLte,
    };
    let conditionCategory = categoryId ? { id: { [Op.in]: categoryId } } : null;
    let conditionColor = color ? { code: { [Op.in]: color } } : null;
    let conditionSize = size ? { name: { [Op.in]: size } } : null;
    const { limit, offset } = getPagination(_page, _limit);
    const product = await Product.findAll({
      where: condition,
      order: [[sort, order]],
      include: [
        {
          where: conditionCategory,
          model: Category,
          as: 'categoryInfo',
          attributes: ['id', 'slug', ['name', 'CategoryName']],
        },
        { model: Image, as: 'imageInfo', attributes: ['url'] },
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
      limit,
      offset,
    });
    const data = getPaginationData(product, _page, _limit);
    res.status(200).json({ status: 'successed', data: data });
  } catch (error) {
    res.status(404).json({ status: 'failed', message: error.message });
  }
};
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      paranoid: false,
      include: [{ model: Image, as: 'imageInfo', attributes: ['url'] }],
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
    id,
    title,
    price,
    amount,
    isPromote,
    description,
    status,
    categoryId,
    fileName,
    sizeInfo,
  } = req.body;
  try {
    const url = await uploadMultipleFile(fileName);
    console.log({ url: url });
    let productData = {
      id: id,
      name: title,
      price: price,
      amount: amount,
      isPromote: isPromote,
      description: description,
      status: status,
      categoryId: categoryId,
      createdBy: req.userInfo.name,
      sizeInfo: sizeInfo.map((size) => {
        return {
          name: size.name,
          ...{ productId: Product.id },
        };
      }),
      colorInfo: [
        {
          name: 'Đỏ',
          code: '#00000',
          productId: Product.id,
        },
      ],
      imageInfo: url.map((item) => ({
        url: item.public_id,
        ...{
          imageableId: Product.id,
          imageableType: 'product',
          name: title,
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
    res.status(201).json({ status: 'successed', data: newProduct });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ status: 'failed', message: error });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.destroy({
      where: { id: id },
    });
    res.status(202).json({ status: 'successed', data: deletedProduct });
  } catch (error) {
    res.status(500).json({ status: 'failed', message: error.message });
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
  const { id } = req.params;
  const dataUpdate = req.body;
  try {
    productUpdated = await Product.update(dataUpdate, {
      where: { id: id },
    });
    res.status(200).json({ status: 'successed', data: productUpdated });
    
  } catch (error) {
    res.status(500).json({ status: 'failed', message: error.message });
  }
};
