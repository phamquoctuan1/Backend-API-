module.exports = (sequelize, DataTypes) => {
  const Banner = sequelize.define('Banner', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        emptyString: false,
      },
    },
    url: {
      type: DataTypes.STRING,
    },
  });

  return Banner;
};
