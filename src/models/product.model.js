const SequelizeSlugify = require('sequelize-slugify');

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'product',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      price: {
        type: DataTypes.INTEGER,
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: { min :0},
      },
      description: {
        type: DataTypes.TEXT,
      },
      slug: {
        type: DataTypes.STRING,
        unique: true,
      },
      discount_percentage: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
      },
      createdBy: {
        type: DataTypes.STRING,
      },
    },
    {
      paranoid: true,
      deleteAt: 'softDelete',
    }
  );

  SequelizeSlugify.slugifyModel(Product, { source: ['name'] });
  return Product;
};
