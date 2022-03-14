const express = require("express");
const { getLoginPg, postLoginPg } = require("../controllers/loginController");
const { validateToken } = require("../controllers/authController");

const router = express.Router();

//prettier-ignore
router
  .route("/")
  .get( getLoginPg)
  .post( postLoginPg);

module.exports = router;
