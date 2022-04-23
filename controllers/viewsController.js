const jwt = require("jsonwebtoken");
const { Products } = require("../public/js/userSchema");
const { Users } = require("../public/js/userSchema");
const catchAsync = require("../utils/catchAsync");

exports.getHomePg = catchAsync(async (req, res) => {
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

exports.getSellersPg = async (req, res, next) => {
  if (!req.cookies.jwt) {
    return res.redirect("/unauthorize-access");
  }

  const products = await Products.find();
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

exports.getProductDetailPg = async (req, res, next) => {
  const id = req.params.id;
  const product = await Products.findOne({ _id: id });
  console.log(product);
  res.status(200).render("productDetail", {
    title: `VDM | Product Detail`,
    product,
    user: req.user || null,
  });
};

exports.getAddProductPg = async (req, res, next) => {
  res.status(200).render("addProduct", {
    title: `VDM | Add a Product`,
    user: req.user || null,
  });
};

exports.postProductDB = catchAsync(async (req, res) => {
  const product = await Products.create(req.body);
  res.json(product);
});
