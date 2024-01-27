// authentification

// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const mongoose = require("mongoose");
// const router = require("./router/index");

// const PORT = process.env.PORT || 5000;
// const DB_URL = process.env.DB_URL;
// const app = express();

// app.use(express.json());
// app.use(cookieParser());
// app.use(cors());
// app.use("/api", router);

// const start = async () => {
//   try {
//     await mongoose.connect(DB_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
//   } catch (e) {
//     console.error("Ошибка подключения к базе данных:", e.message);
//     process.exit(1);
//   }
// };

// start();

// restAPI
require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const DB_URL = process.env.DB_URL;

// Routes
const productsRoutes = require("./api/routes/products");
const ordersRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/user");

const app = express();

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error: ", err.message);
  });

mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use("/uploads",express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS Headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/products", productsRoutes);
app.use("/orders", ordersRoutes);
app.use("/user", userRoutes);

// Error handling
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
