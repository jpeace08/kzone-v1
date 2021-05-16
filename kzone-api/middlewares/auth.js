const jwt = require("jsonwebtoken");

const checkValidToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // if (authHeader) {
  //   const token = authHeader.split(' ')[1];

  //   jwt.verify(token, process.env.SECRET_KEY || "jpeace08", (err, user) => {
  //     if (err) {
  //       console.log(err);
  //       return res.status(403).json({
  //         code: 0,
  //         data: {},
  //         message: "Token is not valid",
  //       })
  //     }

  //     req.user = user;
  //     next();
  //   });
  // } else {
  //   res.sendStatus(401);
  // }
  next();
}

const checkRoles = (req, res, next) => {
  console.log(req.user);
}

module.exports = {
  checkValidToken,
}