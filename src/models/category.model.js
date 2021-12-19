const SequelizeSlugify = require('sequelize-slugify');
require('sequelize-hierarchy')();
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    'category',
    {
      parentId: {
        type: DataTypes.INTEGER,
        hierarchy: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'name',
      },
      slug: {
        type: DataTypes.STRING,
        unique: 'slug',
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

  SequelizeSlugify.slugifyModel(Category, { source: ['name'] });
  return Category;
};
