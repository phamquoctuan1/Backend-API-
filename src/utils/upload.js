const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
exports.deleteAllFile = async (fileStr) => {
  await cloudinary.api.delete_resources(fileStr);
}; 
exports.uploadFile = async (fileStr) => {
  console.log(fileStr);
  const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
    upload_preset: 'avatar_user',
  });
  return uploadedResponse.secure_url;
};

exports.uploadMultipleFile = async (fileStr) => {
  const urlArray = [];
  for (let index = 0; index < fileStr.length; index++) {
    const element = fileStr[index];
    uploadedResponse = await cloudinary.uploader.upload(element, {
      upload_preset: 'product',
    });
    urlArray.push(uploadedResponse);
  }
  return urlArray;
};
