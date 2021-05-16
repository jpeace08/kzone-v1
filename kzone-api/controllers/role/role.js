/**[ROLE] */

const { Role } = require("../../models");

//get all role
const getAllRole = async (req, res, next) => {
  try {
    const roles = await Role.findAll();
    if (roles && roles.length > 0) {
      return res.status(200).json({
        code: 1,
        data: { roles },
        message: "Load successfully!",
      });
    }
    else {
      return res.status(500).json({
        code: 0,
        data: {},
        message: "Load failed!",
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

//create role
const createRole = async (req, res, next) => {
  try {
    const { name, value } = req.body;
    const role = await Role.create({ name, value });
    if (role) {
      return res.status(200).json({
        code: 1,
        data: role,
        message: "Tao moi role thanh cong!",
      });
    }
    else {
      return res.status(400).json({
        code: 0,
        data: {},
        message: "Tao moi role khong thanh cong!",
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

//update role
const updateRole = async (req, res, next) => {
  try {
    const { uuid } = req.params;
    const { name } = req.body;
    const role = Role.findOne({ where: { uuid } });
    if (!role) {
      return res.status(400).json({
        code: 0,
        message: "Role is not exist!",
        data: {},
      });
    }

    role.name = name;
    const roleUpdated = await role.save();
    return res.status(200).json({
      data: roleUpdated,
      message: "Role updated succesfully!",
      code: 1,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 0,
      message: "Cap nhat thong tin dich vu khong thanh cong!",
      message: error
    });
  }
}

//delete role
const removeRole = async (req, res, next) => {
  try {
    const { uuid } = req.params;
    const role = Role.findOne({ where: { uuid } });
    if (!role) {
      return res.status(400).json({
        code: 0,
        message: "Role is not exist!",
        data: {},
      });
    }
    await role.destroy();
    return res.status(200).json({
      code: 1,
      message: "Remove role successfully!",
      data: {},
    });

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
  getAllRole,
  createRole,
  updateRole,
  removeRole,
}