const SequelizeSlugify = require('sequelize-slugify');

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'product',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(value) {
          // value = value.trimStart();
          // value = value.charAt(0).toUpperCase() + value.slice(1);
          this.setDataValue('name', value.trim());
        },
      },
      price: {
        type: DataTypes.INTEGER,
      },
      amount: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      description: {
        type: DataTypes.TEXT,
      },
      isPromote: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
      slug: {
        type: DataTypes.STRING,
        unique: true,
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
      // getterMethods: {
      //   id() {
      //     return (this.id = undefined);
      //   },
      // },
    }
  );

  SequelizeSlugify.slugifyModel(Product, { source: ['name'] });
  return Product;
};
