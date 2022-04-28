const path = require("path");
const staticPath = path.join(__dirname, "../public");

const getSellerPg = (req, res) => {
  res.sendFile(path.join(staticPath, "seller.html"));
};

module.exports = { getSellerPg };
