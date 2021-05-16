const express = require("express");
const router = express.Router();
const {
  serviceController,
} = require("../../../controllers");

/**[SERVICE] */

// get all service
router.get("/", serviceController.getAllSerivce);

//search service
router.get("/search", serviceController.searchService);

//create service
router.post("/create", serviceController.createService);

//udpate service
router.put("/update/:uuid", serviceController.updateService);

//remove service
router.delete("/delete/:uuid", serviceController.removeService);

module.exports = router;