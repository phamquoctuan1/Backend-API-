const app = require('./src/app');
const db = require('./src/models/index');
const { initialRole } = require('./src/utils/initialRole');
const PORT = process.env.PORT || 5000;
require('dotenv').config();

app.listen(PORT, async () => {
  await db.connection();
  await db.sequelize.sync({ alter: false });

  // await initialRole();
  console.log('database sync completed');
  console.log(`Server is running on port 127.0.0.1:${PORT}`);
});
