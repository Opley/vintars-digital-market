const { Users } = require("../public/js/userSchema");
const express = require("express");
const {
  getProductsFromDB,
  getAllProductsDB,
} = require("../controllers/databaseController");
const router = express.Router();

const getUserFromDB = async (req, res, next) => {
  const { email } = req.body;

  const user = await Users.findOne({ email });
  return res.json(user);
};

//prettier-ignore
router
    .route('/')
    .get(getProductsFromDB,getAllProductsDB)

//prettier-ignore
router
  .route('/user')
  .get()
  .post(getUserFromDB)

module.exports = router;
