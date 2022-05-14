const { Products } = require("../public/js/userSchema");
const catchAsync = require("../utils/catchAsync");

exports.addProduct = async (product1) => {
  let product;
  if (product1.id) {
    product = await Products.findOneAndUpdate(
      { _id: product1.id },
      {
        $set: {
          email: product1.email,
          name: product1.name,
          briefDes: product1.briefDes,
          detailedDes: product1.detailedDes,
          imagePaths: product1.imagePaths,
          sizes: product1.sizes,
          stocks: product1.stocks,
          price: product1.price,
        },
      }
    );
  } else {
    console.log("creating a product...");
    product = await Products.create(product1);
    return product;
  }
};

exports.deleteProduct = async (productID) => {
  const product = await Products.findOneAndDelete({ _id: productID });
  return product;
};

exports.getProduct = async (productID) => {
  const product = await Products.findOne({ _id: productID });
  return product;
};

exports.editProduct = async (productID) => {
  const product = await Products.findOne({ _id: productID });
  return product;
};

exports.validateOwner = async (productID, userEmail) => {
  const product = await Products.findOne({ _id: productID });
  if (!product) return false;
  return true;
};

exports.getOwnedProducts = async (user) => {
  const products = await Products.find({ email: user });
  return products;
};
