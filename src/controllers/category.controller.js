const db = require('../models');
const Op = db.Sequelize.Op;
const Product = db.product;
const Category = db.category;

exports.getCategoryParent = async (req, res) => {
  try {
    const category = await Category.findAll();
    res.status(200).json({ message: 'Thành công', data: category });
  } catch (error) {
     res.status(500).json({ message: 'thất bại', error: error.message });
  }
  
};
exports.updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.update(req.body,{
        where: { id: id },
    });
    res.status(200).json({ message: 'Thành công', data: category });
  } catch (error) {
    res.status(500).json({ message: 'thất bại', error: error.message });
  }
}
exports.getCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findByPk(id);
    res.status(200).json({ message: 'Thành công', data: category });
  } catch (error) {
      res.status(500).json({ message: 'thất bại', error: error.message });
  }
  
};

exports.getAllCategory = async (req, res) => {
  try {
    const category = await Category.findAll({
      where: {
        parentId: { [Op.not]: null },
      }, 
      hierarchy: true,
      include: [
        {
          model: Category,
          as: 'children',
        
        },
      ],
    });
    res.status(200).json({ message: 'successfully', data: category });
  } catch (error) {
        res.status(500).json({ message: 'thất bại', error: error.message });
  }

};
exports.deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findByPk(id, {
      include: [
        {
          model: Product,
          as: 'productInfo',
        },
        {
          model: Category,
          as: 'children',
        },
      ],
    });
    if (category.productInfo.length>0 || category.children.length>0)  
      return res.status(400).json({ message: 'Không thể ẩn danh mục này'});
      
      await Category.destroy({ where: { id: id } });
      res.status(200).json({ message: 'Ẩn thành công' });
  } catch (error) {
    res.status(500).json({ message: 'thất bại', error: error.message });
  }
};
exports.createCategory = async (req, res) => {
  const t = await db.sequelize.transaction();
  try { 
     const { name, status, parentId = null } = req.body;
     let categoryData = {
       parentId: parentId,
       name: name,
       status: status,
       createdBy: req.userInfo.name,
     };
     const category = await Category.findOne({
       where: { name: {[Op.like]: `%${name}`} },
       transaction: t,
     });
     if (category) {
        return res
         .status(400)
         .json({
           message: 'Không được nhập trùng tên danh mục',
         });
     }
        const newCategory = await Category.create(categoryData, { transaction: t });
    t.commit();
    res
      .status(201)
      .json({ message: 'Tạo danh mục thành công', data: newCategory });
  } catch (error) {
    t.rollback();
    res
      .status(500)
      .json({ message: 'Thất bại thử lại sau', error: error.message });
  }
};
