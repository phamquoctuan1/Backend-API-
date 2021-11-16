module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('order', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    price: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
    comfirmedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  return Order;
};
