/**[CUSTOMER] */
const {
  Customer,
  Profile,
  User,
  Sequelize
} = require("../../models");
const Op = Sequelize.Op;

//search customer by [id, name, phone]
const search = async (req, res, next) => {
  try {
    const { id = "", name = "", phone = "", page = 0, size = 9999 } = req.params;
    let searchTerm = {
      offset: page,
      limit: size,
      include: {
        model: Profile,
        as: "profile",
      }
    }, data = {};
    if (id) {
      searchTerm = {
        ...searchTerm,
        offset: 0,
        limit: 999,
        where: { id },
      }
    }
    else {
      if (name || phone) {
        let include = {
          model: Profile,
          as: "profile",
        };
        if (name) {
          include = {
            ...include,
            where: {
              name: {
                [Op.like]: `%${name}%`
              },
            }
          }
        };
        if (phone) {
          include = {
            ...include,
            where: {
              ...include.where,
              phone: {
                [Op.like]: `%${phone}%`
              }
            }
          }
        };
        searchTerm = {
          ...searchTerm,
          include: { ...include },
        }
      }
    }
    const { rows, count } = await Customer.findAndCountAll(searchTerm);
    if (count > 0) {
      let customers = rows.map(item => ({
        id: item.id,
        uuid: item.uuid,
        identifyNumber: item.identifyNumber,
        time: item.time,
        profile: {
          ...item.profile.get(),
          createdAt: undefined,
          updatedAt: undefined,
          employeeId: undefined,
        }
      }));
      data = {
        contents: [...customers],
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
      message: "Get data customer successfully!",
      data: {
        ...data,
      }
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 0,
      data: {},
      message: "Something went wrong with server, please try again!",
    })
  }
}

//create customer
const create = async (req, res, next) => {
  try {
    const { name, identifyNumber, dob, email, gender, address, phone, } = req.body;

    //TODO: validate input


    //TODO: create
    let customer = await Customer.create({ identifyNumber, time: 1 });
    let profile = await Profile.create({
      name, dob, email, gender, address, phone, customerId: customer.id,
    });
    customer = {
      id: customer.id,
      uuid: customer.uuid,
      identifyNumber: customer.identifyNumber,
      time: customer.time,
      profile: {
        ...profile.get(),
        createdAt: undefined,
        updatedAt: undefined,
      }
    }

    if (customer) {
      return res.status(200).json({
        code: 1,
        data: { ...customer },
        message: "Tao moi khach hang thanh cong!",
      });
    }
    else {
      return res.status(400).json({
        code: 0,
        data: {},
        message: "Tao moi khach hang khong thanh cong!",
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

//update customer
const update = async (req, res, next) => {
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

//delete customer
const remove = async (req, res, next) => {
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
  create,
  search,
  update,
  remove,
}