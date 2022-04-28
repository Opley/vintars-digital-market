const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { Users, Products } = require("../public/js/userSchema");
const productModel = require("../models/productModel");
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
  console.log("isLoggedIn");

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

exports.isAuth = async (req, res, next) => {
  console.log("isAuth");
  // 1) check if cookie exist
  if (!req.cookies.jwt) return res.redirect("/unauthorize-access");

  // 2) verify if token is NOT expired or IS valid (try,catch locally)
  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);

    // 3) Check if user still exist in DB

    const user = await Users.find({ _id: decoded.id });
    if (!user) return res.redirect("/unauthorize-access");
    req.user = user;
  } catch (err) {
    return res.redirect("/unauthorize-access");
  }

  // 4) Check if user has not changed password since issuance of token
  return next();
};

exports.isOwner = async (req, res, next) => {
  console.log("isOwner");
  const [user] = req.user;
  const result = await productModel.validateOwner(req.params.id, user.email);
  if (!result) return res.redirect("/unauthorize-access");
  next();
};

exports.logout = async (req, res, next) => {
  res.cookie("jwt", "logged out", {
    expiresIn: 10000,
  });

  res.redirect("/login");
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

exports.userSignup = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  console.log(email);
  const checkUser = await Users.findOne({ email });
  if (checkUser) {
    return next(
      new AppError(
        "Please use a different email. That Email already Exist!",
        500
      )
    );
  }

  const user = await Users.create(req.body);
  console.log(req.body);
  const token = signToken(user._id);
  res.cookie("jwt", token, {
    httpOnly: true,
  });

  return res.json({ token, email: user.email });
});
