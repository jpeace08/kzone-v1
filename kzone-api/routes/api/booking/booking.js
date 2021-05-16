const express = require("express");
const router = express.Router();
const {
  bookingController,
} = require("../../../controllers");

/**[CUSTOMER] */

// get all customer
router.get("/", bookingController.getAllBooking);

//search customer
router.get("/search", bookingController.searchBooking);

//create customer
router.post("/create", bookingController.createBooking);

//udpate customer
router.put("/update/:uuid", bookingController.updateBooking);

//remove customer
router.delete("/delete/:uuid", bookingController.removeBooking);

module.exports = router;