const Likes = require("../models/Likes");
const factory = require("./handlerFactory");
const { Products } = require("../models/Products");
const catchAsync = require("../utils/catchAsync");

// exports.likeProduct = async (req, res, next) => {
//   const { productId } = req.body;
//   const userId = req.user.id;
//   const product = await Products.findOne({ _id: productId });

//   let currentIndex = 0;
//   const user = product.likers.find((liker, index) => {
//     currentIndex = index;
//     return liker.user === userId;
//   });
//   if (user) {
//     const [toDelete] = product.likers.splice(currentIndex, 1);
//     await Likes.findOneAndDelete({ _id: toDelete._id });
//     return res.status(200).json({ status: "success", data: "removing user" });
//   }

//   const like = await Likes.create({ user: userId, product: productId });
//   return res.status(200).json({ status: "success", data: like });
// };

exports.checkIfLiked = catchAsync(async (req, res, next) => {
  const { productId } = req.body;
  const userId = req.user.id;
  console.log(userId, "💥💥💥");
  const product = await Products.findOne({ _id: productId });

  let currentIndex = 0;
  const user = product.likers.find((liker, index) => {
    currentIndex = index;
    return liker.userId === userId;
  });
  if (!user) return next();

  const [toDelete] = product.likers.splice(currentIndex, 1);
  await Likes.findOneAndDelete({ _id: toDelete._id });
  return res.status(200).json({ status: "success", data: "removing user" });
});

exports.setUserId = (req, res, next) => {
  if (!req.user) {
    return next(
      new appError(
        res.status(404).json({ status: "failed", data: "User not found!" })
      )
    );
  }
  req.body.userId = req.user.id;
  next();
};

exports.createLike = factory.createOne(Likes);
exports.deleteLike = factory.deleteOne(Likes);
