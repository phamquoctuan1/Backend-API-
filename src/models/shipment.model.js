module.exports = (sequelize, DataTypes) => {
  const Shipment = sequelize.define(
    'shipment',
    {
      ship_method: {
        type: DataTypes.STRING(50),
      },
      ship_cost: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.STRING(50),
        defaultValue: 'Đang giao',
      },
      ship_date: {
        type: DataTypes.DATE,
      },
      estimated_time: {
        type: DataTypes.STRING(10),
        defaultValue: '5 Ngày',
      },
      address: {
        type: DataTypes.TEXT,
      },
      phone: {
        type: DataTypes.STRING(20),
      },
      email: {
        type: DataTypes.STRING(50),
      },
      name_customer: {
        type: DataTypes.STRING(50),
      },
    },
    {
      paranoid: true,
      deleteAt: 'softDelete',
    }
  );
  return Shipment;
};
