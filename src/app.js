const express = require('express');
const cors = require('cors');
const route = require('./routes/index.route');
const app = express();
const { setHeaderAuth } = require('./middleware/setHeaderAuth');

var corsOptions = {
  origin: '*',
  cridentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

route(app);

module.exports = app;
