const dotenv = require("dotenv");
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const { app } = require("./app");

//===========Connecting to Database
dotenv.config({ path: "./config.env" });
const db = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

// MongoClient.connect("mongodb://mongo:27017", () => {
//   console.log("connected to db");
// });

mongoose.connect(db).then(() => {
  console.log("connected to database...");
});

const port = process.env.PORT || 5000;

//===========Server
app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});

// I don't think it is possible to export from server.js
