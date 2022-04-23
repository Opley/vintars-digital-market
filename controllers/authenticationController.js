const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { Users } = require("../public/js/userSchema");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const verifyToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  return decoded;
};

exports.isLoggedIn = async (req, res, next) => {
  // 1) check if cookie exist
  if (!req.cookies.jwt) return next();

  // 2) verify if token is NOT expired or IS valid (try,catch locally)
  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);

    // 3) Check if user still exist in DB
    const user = await Users.find({ _id: decoded.id });
    if (!user) return next();
    req.user = user;

    if (req.originalUrl === "/login" || req.originalUrl === "/signup") {
      return res.redirect("/");
    }
    return next();
  } catch (err) {
    return next();
  }

  // 4) Check if user has not changed password since issuance of token
};

exports.logout = async (req, res, next) => {
  res.cookie("jwt", "logged out", {
    expiresIn: 10000,
  });

  res.status(200).json({
    status: "success",
    message: "logged out successfully.",
  });
};

exports.userLogin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new AppError("Please provide a username or password", 401));
  } else {
    const user = await Users.findOne({ email }).select("+password");

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = signToken(user._id);
      res.cookie("jwt", token, {
        httpOnly: true,
      });
      res
        .status(200)
        .json({ status: "success", message: "user authenticated" });
    } else {
      next(new AppError("Please enter a valid email or password", 401));
    }
  }
};
