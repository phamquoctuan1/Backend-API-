const app = require('./src/app');
const db = require('./src/models/index');
const { productionConfig } = require('./src/utils/common');
const { initialRole } = require('./src/utils/initialRole');
const PORT = process.env.PORT || 5000;
require('dotenv').config();

app.listen(PORT, async () => {
  await db.connection();
  await db.sequelize.sync({ alter: false });
  // await initialRole();
  console.log('database sync completed');
  console.log(
    `Server is running on port ${
      process.env.ENVIROMENT === 'PRODUCTION'
        ? process.env.URL
        : process.env.local
    }:${PORT}`
  );
});
