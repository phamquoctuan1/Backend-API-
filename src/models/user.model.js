module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      // Model attributes are defined here
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      userName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: 'userName',
        set(value) {
          this.setDataValue('userName', value.trim());
        },
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: 'email',
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
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      picture: {
        type: DataTypes.STRING,
        defaultValue:
          'https://res.cloudinary.com/quoctuan/image/upload/v1636304147/dev_setups/kc4yo5bzpwyfgrv3zctq.png',
        allowNull: 'picture',
      },
      refreshToken: {
        type: DataTypes.TEXT,
        unique: 'refreshToken',
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
