const path = require("path");
const { signToken } = require("./authController");
const { Users } = require("../public/js/userSchema");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const staticPath = path.join(__dirname, "../public");

const getSignupPg = (req, res) => {
  res.sendFile(path.join(staticPath, "signup.html"));
};

// const checkSignupBody = catchAsync(async (req, res, next) => {
//   const { name, email, number, password, confirmPassword } = req.body;

//   next();
// });

const postSignupPg = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const checkUser = await Users.findOne({ email });
  if (checkUser) {
    return next(
      new AppError(
        "Please use a different email. That Email already Exist!",
        500
      )
    );
  }

  console.log(checkUser);
  const user = await Users.create(req.body);
  const token = signToken(user._id);

  return res.json({ token, email: user.email });
});

module.exports = { getSignupPg, postSignupPg };
