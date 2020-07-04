var cloudinary = require('cloudinary');
const dotEnv = require('dotenv');
const streamifier = require('streamifier');
dotEnv.config();

/* 
  Configure cloudinary using enviroment variables 
  Check .env.example for a template of setting the enviroment variables.
*/
cloudinary.config({
  // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  // api_key: process.env.CLOUDINARY_API_KEY,
  // api_secret: process.env.CLOUDINARY_API_SERCRET,
  cloud_name: "deqcke1zp",
  api_key: "236236498859965",
  api_secret: "C2VsI8PAoN9kAfUgV2nGbuWd5Sw",
});

uploadVideo = (path) => {
  const cloudinaryOptions = {
    resource_type: 'auto', 
    // chunk_size: 6000000,
    folder: process.env.CLOUDINARY_CLOUD_FOLDER || 'files',
  }
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_large(path, cloudinaryOptions, function (error, result) {
      console.log(path)
      if (error) {
        console.log(error)
        reject(error);
      } else {
        resolve(result);
      }
    })
    // .end(image.buffer);
  });
};

/*
  This function handle the asynchronous action of uploading an image to cloudinary.
  The cloudinary.v2.uploader.upload_stream is used because we are sending a buffer, 
  which the normal cloudinary.v2.upload can't do. More details at https://github.com/cloudinary/cloudinary_npm/issues/130
*/

uploadFromBuffer = (file) => {

   return new Promise((resolve, reject) => {

     let cld_upload_stream = cloudinary.v2.uploader.upload_stream(
      {
        folder: "foo"
      },
     (error, result) => {

        if (result) {
          resolve(result);
        } else {
          reject(error);
         }
       }
     );

     streamifier.createReadStream(file.buffer).pipe(cld_upload_stream);
   });

};

module.exports = {uploadVideo,uploadFromBuffer}
