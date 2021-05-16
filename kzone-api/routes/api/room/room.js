const express = require("express");
const router = express.Router();
const {
  roomController
} = require("../../../controllers");

/**[ROOM] */

//search room
router.get(`\/search(\/page=:page([0-9]{0,}))?(\/size=:size([0-9]{0,}))?(\/id=:id([0-9]{0,}))?(\/roomNumber=:roomNumber([a-z0-9]{0,}))?(\/roomTypeId=:roomTypeId([0-9]{0,}))?(\/status=:status([0-9]{0,}))?(\/floor=:floor([0-9]{0,}))?`, roomController.search);

//create room
router.post("/create", roomController.create);

//udpate room
router.put("/update/:id", roomController.update);

//remove room
router.delete("/delete/:id", roomController.remove);

module.exports = router;