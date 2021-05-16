/**[USER] */

const { User } = require("../../models");

//get all user
const getAllUser = async (req, res, next) => {
  try {
    const { page, size } = req.params;
    const users = await User.findAndCountAll({
      offset: page,
      limit: size,
    });
    if (users && users.length > 0) {
      return res.status(200).json({
        code: 1,
        data: { users },
        message: "Load thong tin user thanh cong!",
      });
    }
    else {
      return res.status(500).json({
        code: 0,
        data: {},
        message: "Load thong tin user khong thanh cong!",
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

//search user
const searchUser = (req, res, next) => {

}

//create user
const createUser = async (req, res, next) => {
  try {
    const { username, password, active, name, dob, email, gender, address, phone, role } = req.body;
    const user = await User.create({
      username, password, active, name, dob, email, gender, address, phone, role
    });
    if (user) {
      return res.status(200).json({
        code: 1,
        data: user,
        message: "Tao moi user thanh cong!",
      });
    }
    else {
      return res.status(400).json({
        code: 0,
        data: {},
        message: "Tao moi user khong thanh cong!",
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

//update user
const updateUser = async (req, res, next) => {
  try {

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 0,
      message: "Cap nhat thong tin dich vu khong thanh cong!",
      message: error
    });
  }
}

//delete user
const removeUser = async (req, res, next) => {
  try {

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
  getAllUser,
  createUser,
  searchUser,
  updateUser,
  removeUser,
}