const { roomRouter } = require("./room");
const { roomTypeRouter } = require("./room-type");
const { serviceRouter } = require("./service");
const { customerRouter } = require("./customer");
const { userRouter } = require("./user");
const { bookingRouter } = require("./booking");
const { authRouter } = require("./auth");
const { roleRoute } = require("./role");
const { employeeRouter } = require("./employee");
const { uploadRouter } = require("./upload");

module.exports = {
  roomRouter,
  roomTypeRouter,
  serviceRouter,
  customerRouter,
  userRouter,
  bookingRouter,
  authRouter,
  roleRoute,
  employeeRouter,
  uploadRouter,
}