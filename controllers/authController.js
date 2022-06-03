const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Users } = require("../models/Users");
const { Products } = require("../models/Products");
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

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  console.log("===================isLoggedIn====================");

  // 1) check if cookie exist
  if (!req.cookies.jwt) return next();

  // 2) verify if token is NOT expired or IS valid (try,catch locally because it's harder to route to next() from errorController)
  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);

    // 3) Check if user still exist in DB
    const user = await Users.findOne({ _id: decoded.id });
    if (!user) return next();
    req.user = user;

    if (req.originalUrl === "/login" || req.originalUrl === "/signup") {
      return next(
        new AppError("USER_ALREADY_LOGGED_IN", "User is already logged in", 403)
      );
    }

    return next();
  } catch (err) {
    return next();
  }

  // 4) Check if user has not changed password since issuance of token
});

const EMPTY_COOKIE_ERROR = () => {
  return new AppError("EMPTY_COOKIE_ERROR", "JWT token doesn't exist", 403);
};

const USER_UNDEFINED_ERROR = () => {
  return new AppError(
    "USER_UNDEFINED",
    "User no longer exist in the database",
    404
  );
};

exports.isAuth = catchAsync(async (req, res, next) => {
  console.log("====================isAuth====================");
  // 1) check if cookie exist
  if (!req.cookies.jwt) return next(EMPTY_COOKIE_ERROR());

  // 2) verify if token is NOT expired or IS valid (catch the error globally)
  const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);

  // 3) Check if user still exist in DB
  const user = await Users.findOne({ _id: decoded.id });
  if (!user) return next(USER_UNDEFINED_ERROR());
  req.user = user;

  // 4) Check if user has not changed password since issuance of token
  return next();
});

exports.isOwner = async (req, res, next) => {
  console.log("====================isOwner====================");
  const user = req.user.email;
  const productOwner = await Products.findOne({ _id: req.params.id });
  // const result = await productModel.validateOwner(req.params.id, user.email);
  if (!productOwner) return res.redirect("/unauthorize-access");
  next();

  // exports.validateOwner = async (productID, userEmail) => {
  //   const product = await Products.findOne({ _id: productID });
  //   if (!product) return false;
  //   return true;
  // };
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
    next(
      new AppError("LOGIN_ERROR", "Please provide a username or password", 401)
    );
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
      next(
        new AppError(
          "LOGIN_ERROR",
          "Please enter a valid email or password",
          401
        )
      );
    }
  }
};

exports.userSignup = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const checkUser = await Users.findOne({ email });
  if (checkUser) {
    return next(
      new AppError(
        "SIGNUP_ERROR",
        "Please use a different email. That Email already Exist!",
        500
      )
    );
  }

  const user = await Users.create(req.body);
  const token = signToken(user._id);
  res.cookie("jwt", token, {
    httpOnly: true,
  });

  res.status(200).json({ status: "success" });
});
