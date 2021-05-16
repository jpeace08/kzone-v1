/**[ROOM] */

const {
  RoomType,
  PricePerDay,
  Room,
  BookingListRoom,
  Sequelize,
} = require("../../models");
const { Op } = Sequelize;
const { STATUS_ROOM } = require("../../constants");

//search room
const search = async (req, res, next) => {
  try {
    const { page = 0, size = 9999, id = "", roomNumber = "", roomTypeId = "", status, floor } = req.params;
    let searchTerm = {
      offset: page,
      limit: size,
      include: {
        model: RoomType,
        as: "roomType",
        include: {
          model: PricePerDay,
          as: "pricePerDays",
        }
      },
    }, data = {};

    if (roomNumber != undefined && roomNumber != null && roomNumber != "") {
      searchTerm = {
        ...searchTerm,
        where: {
          roomNumber: {
            [Op.like]: `%${roomNumber}%`,
          }
        },
      }
    }
    if (roomTypeId) {
      searchTerm = {
        ...searchTerm,
        where: {
          roomTypeId,
          ...searchTerm.where,
        },
      }
    }
    if (status != undefined && status != null && status != "") {
      searchTerm = {
        ...searchTerm,
        where: {
          status,
          ...searchTerm.where,
        },
      }
    }
    if (floor != undefined && floor != null && floor != "") {
      searchTerm = {
        ...searchTerm,
        where: {
          floor,
          ...searchTerm.where,
        },
      }
    }

    const { rows, count } = await Room.findAndCountAll(searchTerm);
    if (count > 0) {
      let rooms = rows.map(room => ({
        ...room.get(),
        createdAt: undefined,
        updatedAt: undefined,
        roomType: {
          ...room.roomType.get(),
          createdAt: undefined,
          updatedAt: undefined
        },
      }));
      data = {
        contents: [...rooms],
        totalElement: count,
        currentPage: page,
        totalPage: count < size
          ? 1 : count % size == 0
            ? Math.floor(count / size)
            : (Math.floor(count / size) + 1)
      }
    }
    else {
      data = {
        contents: [],
        totalElement: count,
        totalPage: 0,
        currentPage: page,
      }
    }

    return res.status(200).json({
      code: 1,
      message: "Get data room successfully!",
      data: {
        ...data,
      }
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 0,
      data: {},
      message: "Something went wrong with server, please try again!"
    })
  }
}

//create room
const create = async (req, res, next) => {
  try {
    const { roomTypeId, roomNumber, status, floor, numberOfBed } = req.body;
    //TODO: validate input

    //TODO: check room number exist with room type
    const roomExist = await Room.findOne({
      where: {
        roomNumber,
        roomTypeId,
      }
    });
    if (roomExist) {
      return res.status(400).json({
        code: 0,
        data: {},
        message: "Phong da ton tai!",
      });
    }

    //TODO: create new room
    const room = await Room.create({
      roomNumber,
      status,
      numberOfBed,
      floor,
      roomTypeId,
    });

    if (room) {
      return res.status(200).json({
        code: 1,
        message: "Tao moi phong thanh cong!",
        data: room,
      })
    }
    else {
      return res.status(400).json({
        code: 0,
        data: {},
        message: "Tao moi phong khong thanh cong!",
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

//update room
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { roomNumber, status, roomTypeId, floor, numberOfBed } = req.body;
    //TODO: check status room: if checked or reserved => ignore
    if (status == STATUS_ROOM.checked) {
      return res.status(400).json({
        code: 0,
        data: {},
        message: "Khong cap nhat trang thai khi phong co khach dat truoc!",
      });
    }
    if (status == STATUS_ROOM.reserved) {
      return res.status(400).json({
        code: 0,
        data: {},
        message: "Khong cap nhat trang thai khi phong co khach o!",
      });
    }

    const count = await Room.update({ numberOfBed, status }, {
      where: { id },
    });

    if (count > 0) {
      const room = await Room.findOne({
        where: { id },
        include: {
          model: RoomType,
          as: "roomType",
        }
      });
      return res.status(200).json({
        code: 1,
        data: room,
        message: "Cap nhat thong tin phong thanh cong!",
      });
    }
    else {
      return res.status(400).json({
        code: 0,
        data: {},
        message: "Cap nhat thong tin phong thanh cong!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 0,
      message: "Cap nhat thong tin phong khong thanh cong!",
      message: error
    });
  }
}

//delete room
const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    //TODO: check room exist in booking room or reserved ? ignore : delete
    const { rows, count } = BookingListRoom.findAndCountAll({
      where: { roomId: id },
    })
    if (count > 0) {
      return res.status(400).json({
        code: 0,
        message: "Xoa phong khong thanh cong!",
        data: {},
      });
    }

    const countRemoved = await Room.destroy({
      where: { id },
    });
    if (countRemoved > 0) {
      return res.status(200).json({
        code: 1,
        message: "Xoa phong thanh cong!",
        data: {},
      });
    }
    else {
      return res.status(400).json({
        code: 0,
        message: "Xoa phong khong thanh cong!",
        data: {},
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 0,
      message: "Xoa phong khong thanh cong!",
      message: error
    });
  }
}

module.exports = {
  search,
  create,
  update,
  remove,
}