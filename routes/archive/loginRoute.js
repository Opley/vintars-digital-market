const express = require("express");
const {
  getLoginPg,
  postLoginPg,
} = require("../../controllers/loginController");
const { validateToken } = require("../../controllers/authController");

const router = express.Router();

const isLoggedIn = (req, res, next) => {
  if (req.cookies.jwt) {
    console.log("this one has jwt");
  }
  next();
};

//prettier-ignore
router
  .route("/")
  .get( isLoggedIn, getLoginPg)
  .post( postLoginPg);

module.exports = router;
