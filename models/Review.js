const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    owner: {
      type: String,
      required: true,
    },

    name: {
      type: String,
    },
    review: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    product: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Products",
        required: [true, "Review must belong to a product!"],
      },
    ],
    user:
      // parent ref:
      [
        {
          type: mongoose.Schema.ObjectId,
          ref: "Users",
          required: [true, "Review must belong to a user"],
        },
      ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  //   this.populate({ path: "user", select: "-_id -__v" }).populate(
  //     "product",
  //     "name price"
  //   );
  this.populate({ path: "user", select: "name" });
  next();
});

reviewSchema.virtual("createdSince").get(function () {
  console.log(Date.now() - this.createdAt);
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

const Review = mongoose.model("reviews", reviewSchema);

module.exports = Review;
