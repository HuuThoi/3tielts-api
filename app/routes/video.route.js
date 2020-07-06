const express = require("express");
const { parseUpload } = require("../middlewares/multer");
const { uploadVideo, uploadFromBuffer } = require("../middlewares/cloudinary");
const controller = require("../controllers/video.controller");
const db = require("../models/index");


const router = express.Router();

router.get("/:limit/:offset", controller.findAll);
router.get("/all", controller.find);
/* Handling image upload */
router.post("/upload", parseUpload() , controller.upload);
router.delete("/:id", controller.delete);

module.exports = router;
