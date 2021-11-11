const { cloudinary } = require('./cloudinary');

exports.uploadFile = async (fileStr) => {
  console.log(fileStr);
  const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
    upload_preset: 'dev_setups',
  });
  return uploadedResponse.public_id;
};

exports.uploadMultipleFile = async (fileStr) => {
  const urlArray = [];
  for (let index = 0; index < fileStr.length; index++) {
    const element = fileStr[index];
    uploadedResponse = await cloudinary.uploader.upload(element, {
      upload_preset: 'dev_setups',
    });
    urlArray.push(uploadedResponse);
  }
  console.log(urlArray);
  return urlArray;
};
