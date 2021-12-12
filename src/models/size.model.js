module.exports = (sequelize, DataTypes) => {
  const Size = sequelize.define('Size', {
    name: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
  });

  return Size;
};
