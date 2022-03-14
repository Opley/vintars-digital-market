const express = require("express");
const {
  getAddProductPg,
  postProductDB,
  postUpdateProductDB,
} = require("../controllers/addProductController");

const router = express.Router();

//prettier-ignore
router
    .route('/')
    .get(getAddProductPg)
    .post(postProductDB)

//prettier-ignore
router
  .route('/update-a-product')
  .post(postUpdateProductDB)

module.exports = router;
