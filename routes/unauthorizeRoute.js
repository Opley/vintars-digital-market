const express = require("express");
const path = require("path");
const staticPath = path.join(__dirname, "../public");

const router = express.Router();

const getUnauthorizePg = (req, res) => {
  res.sendFile(path.join(staticPath, "/unauthorizeAccess.html"));
};

//prettier-ignore
router
    .route('/')
    .get(getUnauthorizePg)
// .patch(getUnauthorizePg)

module.exports = router;
