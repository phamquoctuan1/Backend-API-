module.exports = (sequelize, DataTypes) => {
  const Accessories = sequelize.define(
    'Accessories',
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(value) {
          // value = value.trimStart();
          // value = value.charAt(0).toUpperCase() + value.slice(1);
          this.setDataValue('AccessoriesName', value.trim());
        },
      },
      price: {
        type: DataTypes.INTEGER,
      },
      amount: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      description: {
        type: DataTypes.TEXT,
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
  return Accessories;
};
