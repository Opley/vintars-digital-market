const { Users } = require("../models/Users");
const { Products } = require("../models/Products");
const factory = require("../controllers/handlerFactory");
const catchAsync = require("../utils/catchAsync");

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
  // const products = await productModel.getOwnedProducts(req.user.email);
  const products = await Products.find({ email: req.user.email });

  // exports.getOwnedProducts = async (user) => {
  //   const products = await Products.find({ email: user });
  //   return products;
  // };

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
  const product = await Products.findOne({ _id: id }).populate("reviews");
  const owner = await Users.findOne({ email: product.email });
  console.log(req.user || null);
  res.status(200).render("productDetail", {
    title: `VDM | Product Detail`,
    product,
    owner,
    user: req.user || null,
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

// exports.postProductDB = catchAsync(async (req, res, next) => {
//   const user = req.user;
//   req.body.email = user.email;
//   const product = await Product.addProduct(req.body);
//   res.json(product);
// });

// exports.deleteProduct = factory.deleteOne(Products);

exports.isOwner = factory.isOwner(Products);

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const product = await Products.findOneAndDelete({ _id: id });

  if (!product) {
    return res
      .status(200)
      .json({ status: "success", message: "product has been deleted" });
  }

  req.product = product;
  return next();
});

exports.getUser = catchAsync(async (req, res) => {
  const { productID } = req.body;
  const product = await Users.findOne({ _id: productID });
  const user = await Users.findOne({ email: product.email });

  res.status(200).json(user);
});

exports.get404Pg = async (req, res) => {
  res.status(404).render("404", {
    title: "V-D-M | Page not found!",
    user: req.user || null,
  });
};
