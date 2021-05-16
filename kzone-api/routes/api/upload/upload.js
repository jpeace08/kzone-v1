const express = require("express");
const { upload } = require("../../../middlewares");
const router = express.Router();
const {
  imageController,
} = require("../../../controllers");

/**[UPLOAD] */

//upload single images
router.post("/upload-image", upload.single("file"), imageController.singleImage);

//upload multiple images
router.post("/upload-images", upload.array("files", 12), imageController.multipleImages);

module.exports = router;