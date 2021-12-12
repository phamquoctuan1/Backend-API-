module.exports = (sequelize, DataTypes) => {
  const Color = sequelize.define('Color', {
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(50),
    },
  });

  return Color;
};
