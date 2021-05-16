const express = require("express");
const router = express.Router();
const {
  userController,
} = require("../../../controllers");

/**[USER] */

// get all user
router.get("/:page/:size", userController.getAllUser);

//search user
router.get("/search", userController.searchUser);

//create user
router.post("/create", userController.createUser);

//udpate user
router.put("/update/:uuid", userController.updateUser);

//remove user
router.delete("/delete/:uuid", userController.removeUser);

module.exports = router;