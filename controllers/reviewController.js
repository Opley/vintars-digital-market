const Review = require("../models/Review");
const factory = require("./handlerFactory");
const appError = require("../utils/appError");

exports.setReviewUserId = (req, res, next) => {
  if (!req.user) {
    return next(
      new appError(
        res.status(404).json({ status: "failed", data: "User not found!" })
      )
    );
  }
  req.body.owner = req.user.id;
  req.body.user = req.user;
  next();
};

exports.isOwner = factory.isOwner(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
