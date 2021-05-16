/**[SERVICE] */

const { Service } = require("../../models");

//get all service
const getAllSerivce = async (req, res, next) => {
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

//search service
const searchService = (req, res, next) => {

}

//create service
const createService = async (req, res, next) => {
  try {
    const { name, description, price, roomTypeUUID } = req.body;
    const service = await Service.create({
      name, price, description, roomTypeUUID,
    });

    if (service) {
      return res.status(200).json({
        code: 1,
        message: "Tao moi dich vu thanh cong!",
        data: service,
      })
    }
    else {
      return res.status(500).json({
        code: 0,
        data: {},
        message: "Tao moi dich vu khong thanh cong!",
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

//update service
const updateService = async (req, res, next) => {
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

//delete service
const removeService = async (req, res, next) => {
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
  createService,
  getAllSerivce,
  searchService,
  updateService,
  removeService,
}