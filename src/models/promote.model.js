module.exports = (sequelize, DataTypes) => {
  const Promote = sequelize.define('Promote', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        emptyString: false,
      },
    },
    status: DataTypes.BOOLEAN,
  });

  return Promote;
};
