const express = require("express");
const { validateToken } = require("../controllers/authController");

const router = express.Router();

//prettier-ignore
router
    .route('/')
    .get(validateToken)

module.exports = router;
