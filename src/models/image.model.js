module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define('Image', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
    },
    publicId: {
      type: DataTypes.STRING,
    },
    imageableId: DataTypes.INTEGER,
    imageableType: DataTypes.STRING,
  });

  return Image;
};
