const express = require("express");
const reviewController = require("../controllers/reviewController");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");
const handlerFactory = require("../controllers/handlerFactory");
const { Products } = require("../models/Products");
const { deleteImg } = require("../controllers/s3Controller.js");

const router = express.Router();

router.use(authController.isLoggedIn);

router.get("/", viewsController.getHomePg);

//prettier-ignore
router
  .route("/login")
  .get(viewsController.getLoginPg)
  .post(authController.userLogin)

//prettier-ignore
router
  .route("/signup")
  .get(viewsController.getSignupPg)
  .post(authController.userSignup)

//prettier-ignore
router.get( "/logout", authController.logout, viewsController.getHomePg)

router.get("/seller", authController.isAuth, viewsController.getSellersPg);

router.get("/product-detail/:id", viewsController.getProductDetailPg);

// prettier-ignore
router
  .route("/add-a-product")
  .get(authController.isAuth,  viewsController.getAddProductPg)
// .post(viewsController.postProductDB)

// prettier-ignore
router
  .route("/edit-a-product/:id")
  .get(authController.isAuth, handlerFactory.isOwner(Products), viewsController.getAddProductPg)

// prettier-ignore
router
  .route("/update-a-product")
  .post(viewsController.getHomePg);

// prettier-ignore
router
.route("/delete-a-product")
.post( handlerFactory.isOwner(Products) ,viewsController.deleteProduct, deleteImg)
.delete(viewsController.deleteProduct, )

router.get("/all-products", viewsController.getAllProductsPg);

// prettier-ignore
router
  .route('/user')
  .get()
  .post(viewsController.getUser)

//prettier-ignore
router
  .route("/add-a-review")
  .post(authController.isAuth, reviewController.setReviewUserId, reviewController.createReview)

//prettier-ignore
router
  .route("/update-a-review")
  .patch(authController.isAuth, reviewController.isOwner, reviewController.updateReview)

//prettier-ignore
router
  .route("/delete-a-review")
  .delete(reviewController.deleteReview)

//prettier-ignore
router
  .route("/get-a-review/:id")
  .get(reviewController.getReview)
  .post(reviewController.getReview)
// prettier-ignore
router
  .route("/*")
  .get(viewsController.get404Pg)

module.exports = router;
