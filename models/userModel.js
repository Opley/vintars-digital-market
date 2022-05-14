const { Products } = require("../public/js/userSchema");
const { Users } = require("../public/js/userSchema");

exports.getUser = async (userID) => {
  const product = await Products.findOne({ _id: userID });
  const user = await Users.findOne({ email: product.email });

  return user;
};

exports.getUserByEmail = async (email) => {
  const user = await Users.findOne({ email });
  return user;
};
