import utilities from '../helper/utilities';

const cloudinary = require('cloudinary').v2;

export const obj = {
  getImage: async file => new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
      if (err) reject(err);
      resolve(result.url);
    });
  }),
};

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

export class uploadController {
  static async upload(req, res) {
    const file = req.files.photo;
    try {
      const result = await obj.getImage(file);
      return utilities.successStatus(res, 200, 'data', result);
    } catch (error) {
      return utilities.errorstatus(res, 400, 'Network Error, Could not Upload Image');
    }
  }
}

// export default { uploadController, getImage };
