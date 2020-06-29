var multer  = require('multer');
var path = require('path');
/* 
  Initialize multer. 
  You can also specify multer configuraitons here.
  To limit filesize, you can do something like this:
  multer({
    limits: {
      fileSize: 1 * 1024 * 1024    // Equivalent of 1MB
    }
  });
  NOTE: If you are going to add multer configurations 
  that can lead to errors, ensure to handle the errors properly.
  More details on multer configuration here: https://github.com/expressjs/multer
*/
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'files',
//     // allowedFormats: ['jpg', 'jpeg', 'png', 'mp4', 'svg', 'gif'],
//     // transformation: [{ width: 500, height: 500, crop: 'limit' }],
//   },

// });

// function fileFilter (req, file, callback) {
//   var errorMessage = '';
//   if (!file || file.mimetype !== 'video/mp4') {
//     errorMessage = 'Wrong file type \"' + file.originalname.split('.').pop() + '\" found. Only mp4 video files are allowed!';
//   }
//   if(errorMessage) {
//     return callback({errorMessage: errorMessage, code: 'LIMIT_FILE_TYPE'}, false);
//   }
//   callback(null, true);
// }

// const limits = {
//   // fileSize: parseInt(process.env.FILE_SIZE) * 1024 * 1024 // 200MB
//   fileSize: 200 * 1024 * 1024 // 200MB
// }

// const parser = multer({
//   fileFilter: fileFilter,
//   storage: storage,
//   limits: limits 
// });

const storage = multer.diskStorage({
  destination: './upload/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({storage: storage});

/*
  This middleware would check the form-data coming from the client,
  if there is a single file named 'image', it would make the file 
  available in the server as req.file
  Consequently, (if there is an image uplaod) { req.file === <the image> }
  More details at https://github.com/expressjs/multer
*/

 parseUpload = (req, res,next) => {
  // const temp = upload.single('image');
  // console.log(temp)
  return upload.single('file');
};

module.exports = {parseUpload}

