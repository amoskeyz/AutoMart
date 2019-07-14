import utilities from '../helper/utilities';

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

class uploadController {
  static upload(req, res) {
    const file = req.files.photo;
    cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
      if (err) return utilities.errorstatus(res, 400, 'Network Error, Could not Upload Image');
      return utilities.successStatus(res, 200, 'data', result.url);
    });
  }
}

export default uploadController;
