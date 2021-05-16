const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const {
  roomRouter,
  roomTypeRouter,
  serviceRouter,
  userRouter,
  bookingRouter,
  roleRoute,
  authRouter,
  employeeRouter,
  customerRouter,
  uploadRouter,
} = require("./routes");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static('uploads'));
app.use(cors());

app.use("/room", roomRouter);
app.use("/room-type", roomTypeRouter);
app.use("/service", serviceRouter);
app.use("/user", userRouter);
app.use("/booking", bookingRouter);
app.use("/role", roleRoute);
app.use("/auth", authRouter);
app.use("/employee", employeeRouter);
app.use("/customer", customerRouter);
app.use("/images", uploadRouter);

module.exports = app;