const express = require("express");
const router = express.Router();
const {
  employeeController,
} = require("../../../controllers");

/**[EMPLOYEE] */

//create new employee
router.post("/create", employeeController.create);

//search employee
router.get(`\/search(\/page=:page([0-9]{0,}))?(\/size=:size([0-9]{0,}))?(\/id=:id([0-9]{0,}))?(\/name=:name([a-z]{0,}))?(\/phone=:phone([0-9]{0,}))?(\/active=:active([0-9]{0,1}))?`,
  employeeController.search
);

//update employee
router.put('/update/:id', employeeController.update);


module.exports = router;