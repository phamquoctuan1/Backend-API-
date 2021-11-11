module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      // Model attributes are defined here
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(value) {
          this.setDataValue('userName', value.trim());
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      refreshToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      picture: {
        type: DataTypes.STRING,
        defaultValue: 'dev_setups/kc4yo5bzpwyfgrv3zctq',
        allowNull: true,
      },
    },
    {
      instanceMethods: {
        generateHash(password) {
          return bcrypt.hash(password, bcrypt.genSaltSync(8));
        },
        validPassword(password) {
          return bcrypt.compare(password, this.password);
        },
      },
    }
  );
  return User;
};
