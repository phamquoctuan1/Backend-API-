const productRouter = require('./product.route');

const categoryRouter = require('./category.route');
const authRouter = require('./auth.route');
const userRouter = require('./user.route');
const paymentRouter = require('./payment.route');
const route = (app) => {
  app.use('/api/product', productRouter);

  app.use('/api/category', categoryRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/user', userRouter);
  app.use('/api/payment', paymentRouter);
};

module.exports = route;
