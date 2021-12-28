const db = require(".");

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    'order',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'name',
      },
      amount: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      orderType: {
        type: DataTypes.STRING(50),
      },
      status: {
        type: DataTypes.STRING(50),
        defaultValue: 'Chờ xác nhận',
      },
      comfirmedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      paranoid: true,
      deleteAt: 'softDelete',
    }
  );
  
  return Order;
};
