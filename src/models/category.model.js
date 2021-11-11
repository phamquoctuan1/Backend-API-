const SequelizeSlugify = require('sequelize-slugify');
require('sequelize-hierarchy')();
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('category', {
    parentId: {
      type: DataTypes.INTEGER,
      hierarchy: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: 1,
    },
  });

  SequelizeSlugify.slugifyModel(Category, { source: ['name'] });
  return Category;
};
