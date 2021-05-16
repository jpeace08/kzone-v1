const express = require("express");
const router = express.Router();
const {
  customerController,
} = require("../../../controllers");

/**[CUSTOMER] */

// `\/search
// (\/page=:page([0-9]*))?
// (\/size=:size([0-9]*))?
// (\/id=:id([0-9]*))?
// (\/name=:name([0-9]*))?
// (\/phone=:phone([0-9]*))?`

//search customer
router.get(`\/search(\/page=:page([0-9]{0,}))?(\/size=:size([0-9]{0,}))?(\/id=:id([0-9]{0,}))?(\/name=:name([a-z]{0,}))?(\/phone=:phone([0-9]{0,}))?`,
  customerController.search
);

//create customer
router.post("/create", customerController.create);

//udpate customer
router.put("/update/:uuid", customerController.update);

//remove customer
router.delete("/delete/:uuid", customerController.remove);

module.exports = router;