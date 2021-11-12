const express = require('express');
const cors = require('cors');
const route = require('./routes/index.route');
const app = express();
const { setHeaderAuth } = require('./middleware/setHeaderAuth');

var corsOptions = {
  origin: 'http://localhost:3000',
  cridentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

route(app);

module.exports = app;
