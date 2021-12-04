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
      type: DataTypes.STRING,
    },
    size: {
      type: DataTypes.STRING,
    },
  });
   
   
  return Order_Product;
};
