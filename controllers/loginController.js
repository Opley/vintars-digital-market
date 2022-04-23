const path = require("path");
const { signToken } = require("./authController");
const bcrypt = require("bcrypt");
const { Users } = require("../public/js/userSchema");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const staticPath = path.join(__dirname, "../public");

// Route Handlers
const getLoginPg = (req, res) => {
  console.log(req.cookies);
  res.sendFile(path.join(staticPath, "/login.html"));
};

const postLoginPg = catchAsync(async (req, res, next) => {
  const { email, password, token } = req.body;

  if (!email || !password) {
    next(new AppError("Please provide a username or password", 401));
  } else {
    const user = await Users.findOne({ email }).select("+password");

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = signToken(user._id);
      res.cookie("jwt", token, {
        httpOnly: true,
      });
      // return res.json({ token, email: user.email });
      return res.status(200).json({
        status: "success",
        message: "user verified",
      });
    } else {
      next(new AppError("Please enter a valid email or password", 401));
    }
  }
});

module.exports = { getLoginPg, postLoginPg };
