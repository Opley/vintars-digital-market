const express = require("express");
const likesController = require("../controllers/likesController");
const authController = require("../controllers/authController");

//mini router
const router = express.Router();

//prettier-ignore
router
    .route("/")
    .get()
    .post()

//prettier-ignore
router
    .route("/like-a-product")
    .post(authController.isAuth, likesController.checkIfLiked, likesController.setUserId,likesController.createLike)
    .delete(likesController.deleteLike)

module.exports = router;
