const User = require("../models/userModel");
const Product = require("../models/productModel");
const productModel = require("../models/productModel");
const { Products } = require("../public/js/userSchema");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getHomePg = catchAsync(async (req, res, next) => {
  const products = await Products.find();

  res.status(200).render("index", {
    title: "Vintar's-Digital-Market",
    products,
    user: req.user || null,
  });
});

exports.getLoginPg = (req, res) => {
  res.status(200).render("login", { title: "V-D-M | Login" });
};

exports.getSignupPg = (req, res) => {
  res.status(200).render("signup", { title: "V-D-M | Signup " });
};

exports.getSellersPg = async (req, res, next) => {
  const products = await productModel.getOwnedProducts(req.user.email);
  console.log(products);
  res.status(200).render("seller", {
    title: `VDM | Seller's Page`,
    products,
    user: req.user || null,
  });
};

exports.getAllProductsPg = async (req, res, next) => {
  const products = await Products.find();
  res.status(200).render("allProducts", {
    title: `VDM | All Products`,
    products,
    user: req.user || null,
  });
};

exports.getProductDetailPg = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const product = await Products.findOne({ _id: id });
  const owner = await User.getUserByEmail(product.email);

  res.status(200).render("productDetail", {
    title: `VDM | Product Detail`,
    product,
    owner,
    user: req.user,
  });
});

exports.getAddProductPg = async (req, res, next) => {
  let product;

  if (req.params.id) {
    product = await Products.findOne({ _id: req.params.id });
  }

  return res.status(200).render("addProduct", {
    title: `VDM | Add a Product`,
    user: req.user || null,
    product: product || null,
  });
};

exports.postProductDB = catchAsync(async (req, res, next) => {
  const user = req.user;
  req.body.email = user.email;
  const product = await Product.addProduct(req.body);
  res.json(product);
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const { productID } = req.body;
  const product = await Product.getProduct(productID);
  await productModel.deleteProduct(productID);
  if (!product) return next();

  req.product = product;

  return next();
});

exports.getUser = catchAsync(async (req, res) => {
  const { productID } = req.body;
  const user = await User.getUser(productID);

  res.status(200).json(user);
});

exports.get404Pg = async (req, res) => {
  res.status(404).render("404", {
    title: "V-D-M | Page not found!",
    user: req.user || null,
  });
};
