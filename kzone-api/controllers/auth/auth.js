const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  validatorLoginInput,
  generateToken,
  validatorRegisterInput,
} = require("../../utils");

/**[AUTH] */

const {
  User,
  Role,
  Profile,
  Customer
} = require("../../models");

//logout
const logout = async (req, res, next) => {
  try {
    return res.status(200).json({
      code: 1,
      data: {},
      message: "Logout successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 0,
      data: {},
      message: "Somthing went wrong!",
    })
  }
}

//login
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    //TODO: validate login input
    const { errors, valid } = validatorLoginInput(username, password);
    if (!valid) {
      return res.status(422).json({
        code: 0,
        data: errors,
        message: "Username or password is not valid",
      })
    }

    const user = await User.findOne({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({
        code: 0,
        data: {},
        message: "Login failed!",
      })
    }

    user.roles = await user.getRoles();
    user.roles = (user.roles || []).map(role => ({
      id: role.id,
      name: role.name,
      value: role.value,
    }));

    const match = bcryptjs.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        code: 0,
        data: {},
        message: "Login failed!",
      });
    }

    const token = generateToken(user);
    return res.status(200).json({
      code: 1,
      message: "Login successfully!",
      data: {
        auth: {
          username: user.username,
          token,
          id: user.id,
          totkenType: "Bearer",
        },
        roles: user.roles,
      }
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 0,
      data: {},
      message: error,
    })
  }
}

const register = async (req, res, next) => {
  try {
    const {
      name,
      dob,
      email,
      gender,
      address,
      phone,
      identifyNumber,
      username,
      password,
      confirmPassword,
      roles,
    } = req.body;
    let roleList = [];

    //TODO: validate input


    //TODO: check customer exist
    const customerExist = await Customer.findOne({ where: { identifyNumber } });
    if (customerExist) {
      return res.status(400).json({
        code: 0,
        data: {},
        message: "So can cuoc cong dan da ton tai!",
      })
    }

    //TODO: check user exist
    const userExist = await User.findOne({ where: { username } });
    if (userExist) {
      return res.status(400).json({
        code: 0,
        data: {},
        message: "Username da ton tai!",
      })
    }

    // set up roles
    if (roles.length <= 0) roles = [3];
    else {
      roles.forEach(async id => {
        let role = await Role.findOne({ where: { id } });
        roleList.push(role);
      })
    }
    //TODO: create new customer
    let customer = await Customer.create({ identifyNumber, time: 0 });
    await Profile.create({ name, dob, email, gender, address, phone, customerId: customer.id });
    const pwd = await bcryptjs.hash(password, 12);
    const newUser = await User.create({
      username,
      password: pwd,
      active: true,
      customerId: customer.id,
    });
    if (roleList.length > 0) {
      await newUser.addRoles(roleList);
    }
    const { profile, account } = await Customer.findOne({
      where: { id: customer.id },
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
          identifyNumber,
          ...profile.toJSON(),
        },
        auth: {
          username: account.username,
          token,
          id: account.id,
          totkenType: "Bearer",
        },
        roles: account.roles,
      },
      message: "Register successfully!",
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

module.exports = {
  login,
  register,
  logout,
}