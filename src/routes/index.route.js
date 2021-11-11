const productRouter = require('./product.route');
const paypalRouter = require('./paypal.route');
const categoryRouter = require('./category.route');
const authRouter = require('./auth.route');
const userRouter = require('./user.route');
const route = (app) => {
  app.use('/api/product', productRouter);
  app.use('/api/paypal', paypalRouter);
  app.use('/api/category', categoryRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/user', userRouter);
};

module.exports = route;
