const db = require('../models');
const Op = db.Sequelize.Op;
const Product = db.product;
const Category = db.category;

exports.getAllCategory = async (req, res) => {
  const category = await Category.findAll({
    where: {
      parentId : null
    },
    hierarchy: true,

    include: [{ model: Category, as: 'children' }],
  });
  res.status(200).json({ message: 'successfully', data: category });
};

exports.createCategory = async (req, res) => {
  const { name, status } = req.body;
  let categoryData = {
    name: name,
    status: status,
  };
  console.log(categoryData);
  try {
    const newCategory = await Category.create(categoryData);
    res
      .status(201)
      .json({ message: 'Category created successfully', data: newCategory });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error creating category', error: error.message });
  }
};
