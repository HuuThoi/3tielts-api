import express from 'express';
import { parseUpload } from './middlewares';
import { uploadImage, uploadFromBuffer } from './cloudinary';

const router = express.Router();

/* Handling image upload */
router.post('/image', parseUpload(), (req, res) => {
  if (req.file) { /* Check if there is an image */
    const {originalname} = req.file;
    uploadImage(originalname) /* If there is an image, upload it */
      .then((result) => { /* If the upload is successful */
        res.status(201).json({ /* Send back a success response */
          status: 'success',
          imageCloudData: result
        });
      })
      .catch((error) => { /* If there is an error uploading the image */
       console.log(error.message)
        return res.status(400).json({ /* Send back an error response */
          status: 'error',
          message: error.message
        });
      });
  } else { /* If there is no image  */
    res.status(400).json({ /* Send back a failure message */
      status: 'failed',
      message: 'No image file was uploaded'
    });
  }
});

export default router;