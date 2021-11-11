module.exports = (sequelize, DataTypes) => {
  const Size = sequelize.define('Size', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Size;
};
