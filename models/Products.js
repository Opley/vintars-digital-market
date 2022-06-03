const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    email: String,
    owner: String,
    name: {
      type: String,
      required: [true, "Please enter a product name!"],
    },
    briefDes: {
      type: String,
      required: [true, "Please enter a short description of your product!"],
    },
    detailedDes: {
      type: String,
      required: [true, "Please enter a detailed description of your product!"],
    },
    imagePaths: {
      type: Array,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "Please upload at least one image of your product!",
      },
    },
    sizes: Array,
    stocks: Number,
    price: {
      type: Number,
      required: [true, "Please provide a price for your product!"],
    },
    createAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.pre("findOneAndUpdate", function (next) {
  this.options.runValidators = true;
  next();
});

productSchema.virtual("reviews", {
  ref: "reviews",
  localField: "_id",
  foreignField: "product",
});

productSchema.virtual("likers", {
  ref: "Likes",
  localField: "_id",
  foreignField: "productId",
});

productSchema.pre(/^find/, function (next) {
  this.populate("reviews").populate({
    path: "likers",
    select: "userId",
  });
  next();
});

productSchema.virtual("createdSince").get(function () {
  return Math.floor((Date.now() - this.createAt) / (1000 * 60 * 60 * 24));
});

const Products = mongoose.model("Products", productSchema);

module.exports = { Products };
