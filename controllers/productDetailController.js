const path = require("path");
const { Products } = require("../public/js/userSchema");

const staticPath = path.join(__dirname, "../public");

const getProductsPg = (req, res, next) => {
  res.sendFile(path.join(staticPath, "productDetails.html"));
};

const getProductDB = catchAsync(async (req, res, next) => {
  const { id } = req.body;
  const product = await Products.findOne({ _id: id });
  res.json(product);
});

const deleteProductDB = async (req, res, async) => {
  const { id } = req.body;

  const product = await Products.findOneAndDelete({ _id: id });
  res.json(product);
};

module.exports = { getProductsPg, getProductDB, deleteProductDB };
