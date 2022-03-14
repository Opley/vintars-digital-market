const express = require("express");
const {
  getProductsPg,
  getProductDB,
  deleteProductDB,
} = require("../controllers/productDetailController");

const router = express.Router();

//prettier-ignore
router
.route("/delete")
.post(deleteProductDB);

//prettier-ignore
router
  .route("/:id")
  .get(getProductsPg)
  .post(getProductDB)

module.exports = router;
