const express = require("express");
const {
  getSignupPg,
  postSignupPg,
} = require("../controllers/signupController");

const router = express.Router();

//prettier-ignore
router
  .route("/")
  .get(getSignupPg)
  .post(postSignupPg);

module.exports = router;
