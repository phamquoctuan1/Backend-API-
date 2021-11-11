module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    'order',
    {

      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(value) {
          // value = value.trimStart();
          // value = value.charAt(0).toUpperCase() + value.slice(1);
          this.setDataValue('name', value.trim());
        },
      },
      total: {
        type: DataTypes.INTEGER,
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
      },
    },
    {
      getterMethods: {
        id() {
          return (this.id = undefined);
        },
      },
    }
  );
  return Order;
};
