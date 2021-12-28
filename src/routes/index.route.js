const productRouter = require('./product.route');
const testRouter = require('./test.route');
const categoryRouter = require('./category.route');
const authRouter = require('./auth.route');
const userRouter = require('./user.route');
const orderRouter = require('./order.route');
const paymentRouter = require('./payment.route');
const shiomentRouter = require('./shipment.route')
const route = (app) => {
  
  app.use('/api/product', productRouter);
  app.use('/api/order', orderRouter);  
  app.use('/api/shipment', shiomentRouter);
  app.use('/api/category', categoryRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/user', userRouter);
  app.use('/api/payment', paymentRouter);
  app.use('/api/test', testRouter);
  app.use('/healthcheck', (req, res) => 
  {
    res.status(200).send('OK');
  });
  app.use('/', (req, res) => {
    res.send('Hello');
  });

};

module.exports = route;
