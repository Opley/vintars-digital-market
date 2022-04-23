const express = require("express");
const path = require("path");

const staticPath = path.join(__dirname, "../public");

// const getHomePg = (req, res) => {
//   console.log("test");
//   res.sendFile(path.join(staticPath, "seller.html"));
//   res.send("test");
// };

const checkCookie = (req, res, next) => {
  if (req.cookies.jwt) {
    console.log(req.cookies.jwt);
    // res.json(req.cookies.jwt);
  }
  res.sendFile(path.join(staticPath, "index1.html"));
  // next();
};

const getCookie = (req, res, next) => {
  res.json(req.cookies.jwt);
};

const router = express.Router();

//prettier-ignore
router
  .route("/")
  .get(checkCookie);

router.route("/cookie").get(getCookie);

module.exports = router;
