const { roomController } = require("./room");
const { roomTypeController } = require("./room-type");
const { serviceController } = require("./service");
const { customerController } = require("./customer");
const { userController } = require("./user");
const { bookingController } = require("./booking");
const { authController } = require("./auth");
const { roleController } = require("./role");
const { employeeController } = require("./employee");
const { imageController } = require("./upload");

module.exports = {
  roomController,
  roomTypeController,
  serviceController,
  customerController,
  userController,
  bookingController,
  authController,
  roleController,
  employeeController,
  imageController,
}