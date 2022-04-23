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
// router.get("/login", authController.isLoggedIn, viewsController.getLoginPg);
// router.post("/login", authController.userLogin);

//prettier-ignore
router.get( "/logout", authController.logout, viewsController.getHomePg)

router.get("/seller", authController.isLoggedIn, viewsController.getSellersPg);
router.get(
  "/product-detail/:id",
  authController.isLoggedIn,
  viewsController.getProductDetailPg
);

// prettier-ignore
router
  .route("/add-a-product")
  .get(authController.isLoggedIn, viewsController.getAddProductPg)
  .post(viewsController.postProductDB)

// prettier-ignore
router
  .route("update-a-product")
  .post(viewsController.getHomePg);

//   .route("add-a-product/")
// router.get(
//   "/add-a-product",
//   authController.isLoggedIn,
//   viewsController.getAddProductPg
// );
// router.post("/add-a-product", viewsController.postProductDB);
// router.post("/add-a-product/update-a-product", viewsController.getHomePg);

router.get(
  "/all-products",
  authController.isLoggedIn,
  viewsController.getAllProductsPg
);

module.exports = router;
