const { Products } = require("../public/js/userSchema");

const getProductsFromDB = async (req, res, next) => {
  if (!req.headers.authorization) return next();

  const email = req.headers?.authorization.split(" ")[1] || null;

  const products = await Products.find({ email });
  return res.json(products);
};

const getAllProductsDB = async (req, res, next) => {
  const products = await Products.find();
  return res.json(products);
};

module.exports = { getProductsFromDB, getAllProductsDB };
