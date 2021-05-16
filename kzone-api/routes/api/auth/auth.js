const express = require("express");
const { checkValidToken } = require("../../../middlewares");
const router = express.Router();
const {
  authController,
} = require("../../../controllers");

/**[AUTH] */

//logout
router.get("/logout", authController.logout);

//login
router.post("/login", authController.login);

//register
router.post("/register", authController.register);

module.exports = router;