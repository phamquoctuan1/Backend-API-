const dbConfig = require('../config/db.config.js');
require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

let sequelize 
if(process.env.ENVIROMENT === 'PRODUCTION') 
{
  
   sequelize = new Sequelize(
  process.env.PRODUCTION_DATABASE,
  process.env.PRODUCTION_USER,
  process.env.PRODUCTION_PASSWORD,
  {
    host: process.env.PRODUCTION_HOST,
    dialect: 'mysql',
    operatorsAliases: 0,
    logging: true,

    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  }
)
}
else
{
   sequelize = new Sequelize(
  process.env.DB,
  process.env.USER,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: 'mysql',
    operatorsAliases: 0,
    logging: true,

    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  }
);}

const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
const close = async () => {
  try {
    await sequelize.close();
    console.log('Connection has been colsed successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
};

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.connection = connection;
db.close = close;

//create instance of model

db.banner = require('./banner.model.js')(sequelize, DataTypes);
db.category = require('./category.model.js')(sequelize, DataTypes);
db.color = require('./color.model.js')(sequelize, DataTypes);
db.image = require('./image.model.js')(sequelize, DataTypes);
db.order = require('./order.model.js')(sequelize, DataTypes);
db.product = require('./product.model.js')(sequelize, DataTypes);

db.role = require('./role.model.js')(sequelize, DataTypes);
db.size = require('./size.model.js')(sequelize, DataTypes);
db.user = require('./user.model.js')(sequelize, DataTypes);
db.order_product = require('./order_product.model.js')(sequelize, DataTypes)
db.shipment = require('./shipment.model.js')(sequelize, DataTypes)
db.category.belongsTo(db.category, { as: 'parent', foreignKey: 'parentId' });
db.category.hasMany(db.category, { as: 'children', foreignKey: 'parentId' });

//category with product
db.category.hasMany(db.product, {
  foreignKey: 'categoryId',
  as: 'productInfo',
});
db.product.belongsTo(db.category, {
  foreignKey: 'categoryId',
  as: 'categoryInfo',
});
db.shipment.belongsTo(db.order, {
  foreignKey: 'orderId',
  as: 'orderInfo',
});
db.order.hasOne(db.shipment, {
  foreignKey: 'orderId',
  as: 'shipmentInfo',
});


// user with role
db.role.belongsToMany(db.user, {
  through: 'user_roles',
  foreignKey: 'roleId',
  otherKey: 'userId',
});
db.user.belongsToMany(db.role, {
  through: 'user_roles',
  foreignKey: 'userId',
  otherKey: 'roleId',
});
db.ROLES = ['user', 'admin', 'employee'];

//size with product
db.product.hasMany(db.size, {
  foreignKey: 'productId',
  as: 'sizeInfo',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
db.size.belongsTo(db.product, {
  foreignKey: 'productId',
  as: 'productInfo',
});

//color with product
db.product.hasMany(db.color, {
  foreignKey: 'productId',
  as: 'colorInfo',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
db.color.belongsTo(db.product, {
  foreignKey: 'productId',
  as: 'productInfo',
});

//order with product
db.product.hasMany(db.order_product, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKey: 'productId',
  as: 'OrderDetails',
});
db.order_product.belongsTo(db.product, {
  foreignKey: 'productId',
  as: 'productInfo',
});
db.order.hasMany(db.order_product, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKey: 'orderId',
  as: 'OrderDetails',
});
db.order_product.belongsTo(db.order, {
  foreignKey: 'orderId',
  as: 'orderInfo',
});

//user with order
db.user.hasMany(db.order, {
  foreignKey: 'userId',
  as: 'orderInfo',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
db.order.belongsTo(db.user, {
  foreignKey: 'userId',
  as: 'userInfo',
});

//promote with product


db.banner.hasMany(db.image, {
  foreignKey: 'imageableId',
  constraints: false,
  scope: {
    imageableType: 'banner',
  },
});


db.image.belongsTo(db.banner, {
  foreignKey: 'imageableId',
  constraints: false,
  as: 'banner',
});

db.product.hasMany(db.image, {
  foreignKey: 'imageableId',
  constraints: false,
  scope: {
    imageableType: 'product',
  },
  as: 'imageInfo',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
db.image.belongsTo(db.product, {
  foreignKey: 'imageableId',
  constraints: false,
});



module.exports = db;
