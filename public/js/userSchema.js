const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [3, "Name must be at least (3) characters long!"],
      required: [true, "Please tell us your name!"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email!"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email!"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password!"],
      minlength: [8, "Password length should be (8) chararacters long!"],
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "Please confirm your password!"],
      validate: {
        // this only works on SAve or create NOT update
        validator: function (el) {
          return el === this.password;
        },
        message: "Please type in the correct confirmation password!",
      },
    },
    phone: {
      type: String,
      validate: {
        validator: (v) =>
          validator.isMobilePhone(v, ["de-DE", "en-US", "en-PH"]),
        message: "Please enter a valid phone number!",
      },
    },

    seller: { type: String, default: "false" },
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
  next();
});

userSchema.virtual("createdSince").get(function () {
  return Math.floor((Date.now() - this.createAt) / (1000 * 60 * 60 * 24));
});

const Users = mongoose.model("Users", userSchema);

//=====================================================

const productSchema = new mongoose.Schema(
  {
    email: String,
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
productSchema.virtual("reviews", {
  ref: "reviews",
  localField: "_id",
  foreignField: "product",
});

productSchema.pre(/^find/, function (next) {
  this.populate("reviews");
  next();
});

productSchema.pre("findOneAndUpdate", function (next) {
  this.options.runValidators = true;
  next();
});

productSchema.virtual("createdSince").get(function () {
  return Math.floor((Date.now() - this.createAt) / (1000 * 60 * 60 * 24));
});

// productSchema.post("save", function (next) {
//   console.log("Schema.post operation🏃‍♂️🏃‍♂️🏃‍♂️🏃‍♂️🏃‍♂️");
//   console.log(this);
//   // this.tempImagePaths.forEach(path => {
//   //   const test = await fetch(s3uploadPaths[i], {
//   //     method: "PUT",
//   //     headers: new Headers({ "Content-Type": "multipart/form-data" }),
//   //     body: file,
//   //   });
// });

const Products = mongoose.model("Products", productSchema);

module.exports = { Users, Products };
