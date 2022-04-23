const express = require("express");
const { getSellerPg } = require("../../controllers/sellerController");
const { sellerCheckIfLoggedIn } = require("../../utils/utils");

const router = express.Router();

// router.use("/", sellerCheckIfLoggedIn);

//prettier-ignore
router
    .route("/")
    .get(getSellerPg)

//prettier-ignore

module.exports = router;
