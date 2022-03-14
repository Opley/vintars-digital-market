const express = require("express");
const path = require("path");

const staticPath = path.join(__dirname, "../public");
const getProductDetail = (req, res) => {
  res.sendFile(path.join(staticPath, "allProducts.html"));
};

const router = express.Router();

//prettier-ignore
router
  .route("/")
  .get(getProductDetail);

module.exports = router;
