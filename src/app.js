const express = require('express');
const cors = require('cors');
const route = require('./routes/index.route');
const { cloudinary } = require('./utils/cloudinary');
const app = express();
const { setHeaderAuth } = require('./middleware/setHeaderAuth');

var corsOptions = {
  origin: 'http://localhost:3000',
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

app.post('/api/upload', async (req, res) => {
  try {
    const { fileStr } = req.body;
    console.log(fileStr);
    const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: 'dev_setups',
    });
    console.log(uploadedResponse);
    res.status(200).json({ data: uploadedResponse });
  } catch (error) {
    console.log(error);
  }
});
route(app);

module.exports = app;
