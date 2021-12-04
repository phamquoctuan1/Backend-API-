module.exports = (sequelize, DataTypes) => {
  const Shipment = sequelize.define(
    'shipment',
    {
      ship_method: {
        type: DataTypes.STRING,
      },
      ship_cost: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
      ship_date: {
        type: DataTypes.DATE,
      },
      estimated_time: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      name_customer: {
        type: DataTypes.STRING,
      },
    },
    { timestamps: false }
  );
  return Shipment;
};
