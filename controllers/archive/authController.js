// const jwt = require("jsonwebtoken");
// const AppError = require("../utils/appError");
// const { catchAsync } = require("../utils/catchAsync");

// const signToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN,
//   });
// };

// const verifyToken = (token) => {
//   const decoded = jwt.verify(token, process.env.JWT_SECRET);

//   return decoded;
// };

// const validateToken = (req, res, next) => {
//   token = req.headers.authorization.split(" ")[1];
//   // the code below automatically returns an Error in this format:
//   // next(new AppError('Invalid token'))
//   const decoded = jwt.verify(token, process.env.JWT_SECRET);

//   // return res.send({ decoded });
//   // if (!decoded) {
//   //   return next(new AppError("Your token is invalid. Please log in!", 401));
//   // }

//   return res.json({ status: "success", message: decoded });
// };

// module.exports = { signToken, verifyToken, validateToken };
