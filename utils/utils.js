const { signToken, verifyToken } = require("../controllers/authController");
const AppError = require("./appError");

const checkIfLoggedIn = (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1] || null;

  console.log(token);
  if (!token) {
    return next();
  }

  if (verifyToken(token)) {
    res.json(verifyToken(token));
  }
};

const sellerCheckIfLoggedIn = (req, res, next) => {
  console.log("💥💥💥💥");
  const token = req.headers?.authorization?.split(" ")[1] || null;
  console.log(token);

  if (!token) {
    // next(new AppError("There is no token.", 401));
    return res.redirect("/login");
  }

  if (verifyToken(token)) {
    res.json(true);

    next();
  }
};

module.exports = { checkIfLoggedIn, sellerCheckIfLoggedIn };
