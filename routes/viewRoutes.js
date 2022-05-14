const express = require("express");
const restify = require("express-restify-mongoose");
const { Products } = require("../public/js/userSchema");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authenticationController");
const { deleteImg } = require("../controllers/s3Controller.js");

const router = express.Router();
restify.serve(router, Products, {
  postCreate: function (req, res, next) {
    const result = req.erm.result;

    result.tempFilePath = ["test", "test2"];
    next();
  },
});

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
  .post(viewsController.postProductDB)

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
.post( viewsController.deleteProduct, deleteImg)

router.get("/all-products", viewsController.getAllProductsPg);

// prettier-ignore
router
  .route('/user')
  .get()
  .post(viewsController.getUser)

// prettier-ignore
router
  .route("/*")
  .get(viewsController.get404Pg)

module.exports = router;
