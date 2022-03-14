const express = require("express");
const path = require("path");

const staticPath = path.join(__dirname, "../public");

const getHomePg = (req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
};

const router = express.Router();

//prettier-ignore
router
  .route("/")
  .get(getHomePg);

module.exports = router;
