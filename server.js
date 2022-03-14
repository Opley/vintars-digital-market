const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { app } = require("./app");

//===========Connecting to Database
dotenv.config({ path: "./config.env" });
const db = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(db).then(() => {
  console.log("connected to database...");
});

//===========Server
app.listen(3000, "127.0.0.1", () => {
  console.log("server is listening on port 3000");
});

// I don't think it is possible to export from server.js
