const db = require(".");

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('order', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    orderType: {
      type: DataTypes.STRING,
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
