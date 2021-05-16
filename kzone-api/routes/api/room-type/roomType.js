const express = require("express");
const { checkValidToken } = require("../../../middlewares");
const router = express.Router();
const {
  roomTypeController,
} = require("../../../controllers");

/**[ROOM] */

//search room type
router.get(`\/search(\/page=:page([0-9]{0,}))?(\/size=:size([0-9]{0,}))?(\/id=:id([0-9]{0,}))?(\/name=:name([0-9]{0,}))?`, checkValidToken, roomTypeController.search);

//create room type
router.post("/create", checkValidToken, roomTypeController.create);

//udpate room type
router.put("/update/:id", checkValidToken, roomTypeController.update);

//remove room type
router.delete("/delete/:id", checkValidToken, roomTypeController.remove);

module.exports = router;