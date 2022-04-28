const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authenticationController");

const router = express.Router();

router.get("/", authController.isLoggedIn, viewsController.getHomePg);

//prettier-ignore
router
  .route("/login")
  .get(authController.isLoggedIn, viewsController.getLoginPg)
  .post(authController.userLogin)

//prettier-ignore
router
  .route("/signup")
  .get(authController.isLoggedIn, viewsController.getSignupPg)
  .post(authController.userSignup)

//prettier-ignore
router.get( "/logout", authController.logout, viewsController.getHomePg)

router.get(
  "/seller",
  authController.isLoggedIn,
  authController.isAuth,
  viewsController.getSellersPg
);

router.get(
  "/product-detail/:id",
  authController.isLoggedIn,
  viewsController.getProductDetailPg
);

// prettier-ignore
router
  .route("/add-a-product")
  .get(authController.isLoggedIn, authController.isAuth,  viewsController.getAddProductPg)
  .post(authController.isLoggedIn, viewsController.postProductDB)

// prettier-ignore
router
  .route("/edit-a-product/:id")
  .get(authController.isAuth, authController.isOwner, viewsController.getAddProductPg)

// prettier-ignore
router
  .route("/update-a-product")
  .post(viewsController.getHomePg);

// prettier-ignore
router
.route("/delete-a-product")
.post(viewsController.deleteProduct)

router.get(
  "/all-products",
  authController.isLoggedIn,
  viewsController.getAllProductsPg
);

// prettier-ignore
router
  .route('/user')
  .get()
  .post(viewsController.getUser)

// prettier-ignore
router
  .route("/*")
  .get(authController.isLoggedIn, viewsController.get404Pg)

module.exports = router;
