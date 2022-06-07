const authController = require("../controllers/authController");
const { deleteS3Object } = require("../controllers/s3Controller.js");
const express = require("express");

const {
  generateUrl,
  uploadImgs,
  resizeImg,
  uploadUserPhoto,
} = require("../controllers/s3Controller.js");

const router = express.Router();
router.use(authController.isLoggedIn);

//prettier-ignore
router
  .route("/")
  .get(generateUrl)
  .post(uploadUserPhoto, resizeImg)

//prettier-ignore
router
  .route("/deleteObject")
  .post(deleteS3Object)

module.exports = router;
