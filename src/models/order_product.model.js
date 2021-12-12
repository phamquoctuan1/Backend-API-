module.exports = (sequelize, DataTypes) => {
  const Order_Product = sequelize.define('order_product', {
    productName: {
      type: DataTypes.STRING,
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
    price: {
      type: DataTypes.INTEGER,
    },
    color: {
      type: DataTypes.STRING(50),
    },
    size: {
      type: DataTypes.STRING(3),
    },
  });
   
   
  return Order_Product;
};
