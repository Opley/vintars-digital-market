const path = require("path");
const { Products, Users } = require("../../public/js/userSchema");
const { verifyToken } = require("./authController");
const catchAsync = require("../../utils/catchAsync");
const staticPath = path.join(__dirname, "../public");

const getAddProductPg = (req, res) => {
  res.sendFile(path.join(staticPath, "addProduct.html"));
};

const postProductDB = catchAsync(async (req, res) => {
  const product = await Products.create(req.body);
  res.json(product);
});

const postUpdateProductDB = catchAsync(async (req, res) => {
  const {
    id,
    briefDes,
    detailedDes,
    imagePaths,
    name,
    price,
    sizes,
    stocks,
    token,
  } = req.body;

  // validate email
  const userId = verifyToken(token).id;
  const user = await Users.findOne({ _id: userId });
  const product = await Products.findOne({ _id: id });

  if (user.email !== product.email) {
    return res.json({
      status: "error",
      message: "this user does not own the product!",
    });
  }

  product.briefDes = briefDes;
  product.detailedDes = detailedDes;
  product.imagePaths = imagePaths;
  product.name = name;
  product.price = price;
  product.sizes = sizes;
  product.stocks = stocks;
  await product.save();
  return res.json({ product });
});

module.exports = { getAddProductPg, postProductDB, postUpdateProductDB };
