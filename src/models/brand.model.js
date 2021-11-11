module.exports = (sequelize, DataTypes) => {
  const Brand = sequelize.define('Brand', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        emptyString: false,
      },
    },
  });

  return Brand;
};
