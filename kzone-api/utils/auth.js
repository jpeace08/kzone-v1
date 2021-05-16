const jwt = require("jsonwebtoken");

module.exports.validatorProfileInput = (
  name,
  dob,
  email,
  gender,
  address,
  phone,
  username,
  password,
  confirmPassword,
  roles,
) => {
  const errors = {};



  return {
    errors,
    valid: Object.keys(errors).length < 1
  }
}

module.exports.validateIdentifyNumber = ({ id, ...payload }) => {
  const errors = {};


  return {
    errors,
    valid: Object.keys(errors).length < 1
  }
}

module.exports.validatorLoginInput = (
  username,
  password
) => {
  const errors = {};


  return {
    errors,
    valid: Object.keys(errors).length < 1
  }
}


module.exports.generateToken = (user) => jwt.sign({
  id: user.id,
  username: user.username,
  password: user.password,
  roles: user.roles.map(role => role.value),
}, (process.env.SECRET_KEY || "jpeace08"), { expiresIn: '1h' });