const express = require("express");
const { generateUrl } = require("../controllers/s3Controller");

const router = express.Router();

//prettier-ignore
router
  .route("/")
  .get(generateUrl)

module.exports = router;
