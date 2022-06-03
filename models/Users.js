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

module.exports = { Users };
