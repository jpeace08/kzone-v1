const express = require("express");
const router = express.Router();
const {
  roleController,
} = require("../../../controllers");

/**[ROLE] */

// get all role
router.get("/", roleController.getAllRole);

//create role
router.post("/create", roleController.createRole);

//udpate role
router.put("/update/:uuid", roleController.updateRole);

//remove role
router.delete("/delete/:uuid", roleController.removeRole);

module.exports = router;