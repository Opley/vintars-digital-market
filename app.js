const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const globalErrorHandler = require("./controllers/errorController");

const viewRouter = require("./routes/viewRoutes");
const s3Router = require("./routes/s3Router");
const unauthorizeAccessRouter = require("./routes/unauthorizeRoute");

//========== Static Path
const staticPath = path.join(__dirname, "/public");

//===========Initializing Express
const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//=========== Middlewares
app.enable("trust proxy");
app.use(express.static(staticPath));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  console.log("Hello from the middleware😊😊");
  next();
});

//============ Routes
app.use("/s3url", s3Router);
app.use("/unauthorize-access", unauthorizeAccessRouter);
app.use("/", viewRouter);

// ===========Error handling middleware
app.use(globalErrorHandler);

module.exports = { app };
