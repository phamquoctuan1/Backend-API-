exports.setHeaderAuth = (req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, Origin, Content-Type, Accept'
  );
  next();
};
