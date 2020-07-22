const express = require("express");
const { parseUpload } = require("../middlewares/multer");
const { uploadVideo, uploadFromBuffer } = require("../middlewares/cloudinary");
const controller = require("../controllers/video.controller");
const db = require("../models/index");
const { authJwt } = require("../middlewares/index");

const router = express.Router();

router.get("/:limit/:offset", [authJwt.verifyToken], controller.findAll);
router.get("/all", [authJwt.verifyToken], controller.find);
/* Handling image upload */
router.post("/upload", [authJwt.verifyToken], parseUpload() , controller.upload);
router.delete("/:id", controller.delete);

module.exports = router;
