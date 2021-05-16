/**[BOOKING] */

const { Booking, User, Customer, BookingListRoom } = require("../../models");

//get all booking
const getAllBooking = async (req, res, next) => {
  try {
    const services = await Service.findAll({
      where: {
        // deletedAt: null,
      },
    });
    if (services && services.length > 0) {
      return res.status(200).json({
        code: 1,
        data: { services },
        message: "Lay thong tin dich vu thanh cong !",
      });
    }
    else {
      return res.status(400).json({
        code: 0,
        data: {},
        message: "Lay thong tin dich vu khong thanh cong!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 0,
      data: {},
      message: error,
    });
  }
}

//search booking
const searchBooking = (req, res, next) => {

}

//create booking
const createBooking = async (req, res, next) => {
  try {
    const {
      userUUID,
      customer,
      rooms,
      status,
      prepay,
      checkinDate,
      checkoutDate,
      typeOfBooking,
      isGroup,
      typeOfPayment,
      refund,
      totalPerson,
      totalServiceAmount,
      totalRoomBooked,
      totalRoomAmount,
      totalPayment,
    } = req.body;
    let customerObject;
    //create customer if not exist
    if (!customer.uuid) {
      customerObject = await Customer.create({ ...customer });
    }
    else {
      customerObject = await Customer.findOne({ where: { uuid: customer.uuid, } });
    }
    if (!userUUID) {
      return res.status(400).json({
        code: 0,
        data: {},
        message: "User khong ton tai!",
      });
    }
    if (rooms && rooms.length <= 0) {
      return res.status(400).json({
        code: 0,
        data: {},
        message: "Vui long them phong vao phieu thue!",
      });
    }
    const user = User.findOne({ where: { uuid: userUUID } });

    const booking = await Booking.create({
      status,
      prepay,
      checkinDate,
      checkoutDate,
      typeOfBooking,
      isGroup,
      typeOfPayment,
      refund,
      totalPerson,
      totalServiceAmount,
      totalRoomBooked,
      totalRoomAmount,
      totalPayment,
      customerId: customerObject.id,
      userId: user.id,
    });

    rooms.forEach(async room => {
      await BookingListRoom.create({
        bookingId: booking.id,
        roomId: room.roomId,
        numberOfPerson: room.numberOfPerson,
      });
    });

    return res.status(200).json({});
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 0,
      data: {},
      message: error,
    });
  }
}

//update booking
const updateBooking = async (req, res, next) => {
  try {
    const { uuid } = req.params;
    const { name, description, price, roomTypeId } = req.body;

    const count = await Service.update({ name, description, price, roomTypeId }, {
      where: { uuid },
    });
    if (count > 0) {
      const service = await Service.findOne({ where: { uuid } });
      res.status(200).json({
        code: 1,
        data: service,
        message: "Cap nhat thong tin dich vu thanh cong!",
      });
    }
    else {
      res.status(400).json({
        code: 0,
        data: service,
        message: "Cap nhat thong tin dich vu thanh cong!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 0,
      message: "Cap nhat thong tin dich vu khong thanh cong!",
      message: error
    });
  }
}

//delete booking
const removeBooking = async (req, res, next) => {
  try {
    const { uuid } = req.params;
    const count = await Service.destroy({
      where: { uuid },
    });
    if (count > 0) {
      return res.status(200).json({
        code: 1,
        message: "Xoa dich vu thanh cong!",
        data: {},
      });
    }
    else {
      return res.status(400).json({
        code: 0,
        message: "Xoa dich vu khong thanh cong!",
        data: {},
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 0,
      message: "Xoa dich vu khong thanh cong!",
      message: error
    });
  }
}


module.exports = {
  getAllBooking,
  createBooking,
  searchBooking,
  updateBooking,
  removeBooking,
}