const express = require("express");
const { parseUpload } = require("../middlewares/multer");
const { uploadVideo, uploadFromBuffer } = require("../middlewares/cloudinary");
const { upload } = require('../middlewares/s3UploadClient')
const controller = require("../controllers/video.controller");
const db = require("../models/index");
const { authJwt } = require("../middlewares/index");

const router = express.Router();

router.get("/:limit/:offset", [authJwt.verifyToken], controller.findAll);
router.get("/all", [authJwt.verifyToken], controller.find);
/* Handling image upload */
router.post("/upload", [authJwt.verifyToken], parseUpload() , controller.upload);
router.post("/upload-document", [authJwt.verifyToken],  upload.array("file", 1) , controller.uploadDocument);
router.delete("/:id", controller.delete);

module.exports = router;
