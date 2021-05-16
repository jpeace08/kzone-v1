const bcryptjs = require("bcryptjs");
const {
  generateToken,
} = require("../../utils");

/**[EMPLOYEE] */

const {
  User,
  Role,
  Profile,
  Employee,
  Sequelize,
} = require("../../models");
const { Op } = Sequelize;

//create employee
const create = async (req, res, next) => {
  try {
    const {
      name,
      dob,
      email,
      gender,
      address,
      phone,
      avatar,
      username,
      password,
      confirmPassword,
      roles,
    } = req.body;
    let roleList = [];

    //TODO: validate input


    //TODO: check phone exist
    const epl = await Employee.findOne({
      include: {
        model: Profile,
        as: "profile",
        require: true,
        where: {
          phone,
        }
      }
    });
    if (epl) {
      return res.status(400).json({
        code: 0,
        data: {},
        message: "So dien thoai ton tai trong he thong",
      })
    }

    //TODO: check user exist
    const userExist = await User.findOne({ where: { username } });
    if (userExist) {
      return res.status(400).json({
        code: 0,
        data: {},
        message: "Ten dang nhap da ton tai!",
      })
    }

    // set up roles
    if (roles.length <= 0) roles = [5];
    roles.forEach(async ro => {
      let role = await Role.findOne({
        where: {
          value: {
            [Op.eq]: ro,
          }
        }
      });
      roleList.push(role);
    })

    //TODO: create new employee
    let employee = await Employee.create({ avatar: avatar || "no-image.jpg", active: false });
    await Profile.create({ name, dob, email, gender, address, phone, employeeId: employee.id });
    const pwd = await bcryptjs.hash(password, 12);
    const newUser = await User.create({
      username,
      password: pwd,
      active: false,
      employeeId: employee.id,
    });
    if (roleList.length > 0) {
      await newUser.addRoles(roleList);
    }
    const { profile, account, ...payload } = await Employee.findOne({
      where: { id: employee.id },
      include: [
        {
          model: Profile,
          as: "profile"
        },
        {
          model: User,
          as: "account",
          include: {
            model: Role,
            as: "roles",
          }
        }
      ]
    })

    account.roles = account.roles.map(role => ({
      id: role.id,
      name: role.name,
      value: role.value,
    }));

    const token = generateToken(account);

    return res.status(200).json({
      code: 1,
      data: {
        profile: {
          avatar: payload.dataValues.avatar,
          ...profile.toJSON(),
        },
        auth: {
          username: account.username,
          token,
          id: account.id,
          totkenType: "Bearer",
          roles: account.roles,
        },
      },
      message: "Add new employee successfully!",
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error,
      data: {},
      code: 0,
    })
  }
}

//search employee
const search = async (req, res, next) => {
  try {
    const { id = "", name = "", phone = "", active = 1, page = 0, size = 9999 } = req.params;
    let searchTerm = {
      offset: page,
      limit: size,
      include: {
        model: Profile,
        as: "profile",
      },
      where: { active: active == 1 ? true : active == 0 ? false : true },
    }, data = {};
    if (id) {
      searchTerm = {
        ...searchTerm,
        offset: 0,
        limit: 999,
        where: { id, ...searchTerm.where },
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
              ...include.where,
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
    const { rows, count } = await Employee.findAndCountAll(searchTerm);
    if (count > 0) {
      let employees = rows.map(item => ({
        id: item.id,
        uuid: item.uuid,
        avatar: item.avatar,
        active: item.active,
        profile: {
          ...item.profile.get(),
          createdAt: undefined,
          updatedAt: undefined,
          employeeId: undefined,
        }
      }));
      data = {
        contents: [...employees],
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
      message: "Get data employee successfully!",
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

//update employee
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { } = req.body;
    if (id == undefined || id == null) {
      return res.status(400).json({
        code: 0,
        data: {},
        message: "Param is not defined!",
      })
    }

    //TODO: validate input

    //TODO: update:


  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 0,
      data: {},
      message: "Something went wrong with server, please try again!",
    })
  }
}

module.exports = {
  create,
  search,
  update,
}