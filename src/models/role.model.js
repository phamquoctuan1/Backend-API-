module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('roles', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(10),
    },
  });
  return Role;
};
