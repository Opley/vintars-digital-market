//=============Paymongo
const Paymongo = require("paymongo");

const paymongo = new Paymongo("sk_test_nYyPmVJ9A2HNKg4ns1aeeVhG");

const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const globalErrorHandler = require("./controllers/errorController");

const viewRouter = require("./routes/viewRoutes");
const s3Router = require("./routes/s3Router");
const unauthorizeAccessRouter = require("./routes/unauthorizeRoute");
const likesRoutes = require("./routes/likesRoutes");

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
app.use("/api/likes", likesRoutes);

app.post("/paymongo-hook", async (req, res) => {
  console.log("paymongo hook", "💥💥💥💥");

  const { data } = req.body;

  const newData = {
    data: {
      attributes: {
        amount: data.attributes.data.attributes.amount,
        currency: "PHP",
        source: {
          id: data.id, // Id of the Source resource.
          type: "source", //
        },
      },
    },
  };

  if (data.attributes.type === "source.chargeable") {
    const result = await paymongo.payments.create(newData);

    console.log(result);
  }
});

// ===========Error handling middleware
app.use(globalErrorHandler);

module.exports = { app };
