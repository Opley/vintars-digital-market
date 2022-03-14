const express = require("express");
const path = require("path");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const loginRouter = require("./routes/loginRoute.js");
const signupRouter = require("./routes/signupRoute.js");
const authRouter = require("./routes/authRoute.js");

const sellerRouter = require("./routes/sellerRoute");
const addProductRouter = require("./routes/addProductRoute");
const homeRouter = require("./routes/homeRoute");
const allProductsRouter = require("./routes/allProductsRoute");
const productDetailRouter = require("./routes/productDetailRoute");
const databaseRouter = require("./routes/databaseRoute");
const s3Router = require("./routes/s3Router");

const tokenRouter = require("./routes/tokenRoute");
const unauthorizeAccessRouter = require("./routes/unauthorizeRoute");

const staticPath = path.join(__dirname, "/public");

//===========Initializing Express
const app = express();

//middlewares
app.use(express.static(staticPath));
app.use(express.json());
app.use((req, res, next) => {
  console.log("Hello from the middleware😊");
  next();
});

//============ Routes
app.use("/", homeRouter);
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/auth", authRouter);

// app.use("/protected", protectedRouter);
// app.use("/token", tokenRouter);
app.use("/seller", sellerRouter);
app.use("/add-a-product", addProductRouter);

app.use("/product-detail", productDetailRouter);
app.use("/unauthorize-access", unauthorizeAccessRouter);
app.use("/database", databaseRouter);
app.use("/all-products", allProductsRouter);
app.use("/s3url", s3Router);

app.get("*", (req, res, next) => {
  next(new AppError("Cant find url on the server", 404));
  // res.sendFile(staticPath, "/404.html");
});

// ===========Error handling middleware
app.use(globalErrorHandler);

module.exports = { app };
