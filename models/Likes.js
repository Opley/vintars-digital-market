const mongoose = require("mongoose");

const LikesSchema = new mongoose.Schema({
  userId: String,
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: "Products",
  },
});

const Likes = mongoose.model("Likes", LikesSchema);

module.exports = Likes;
