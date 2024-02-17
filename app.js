require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swaggerSpec");

// Routes
const productsRoutes = require("./api/routes/products");
const ordersRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/user");
const authRoutes = require("./api/routes/auth");
const refreshRoutes = require("./api/routes/refresh");
const logoutRoutes = require("./api/routes/logout");
const adminRoutes = require("./api/routes/admin");

const app = express();
const DB_URL = process.env.DB_URL;

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error: ", err.message);
  });

mongoose.Promise = global.Promise;

app.use(cors({ credentials: true, origin: "http://localhost:5000" }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));

// Настройка сессии
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      sameSite: "None",
      secure: false,
    },
  })
);

// Инициализация Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// CORS Headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5000");
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

const apiUrl = "/api/v1";
app.use(`${apiUrl}/products`, productsRoutes);
app.use(`${apiUrl}/orders`, ordersRoutes);
app.use(`${apiUrl}/user`, userRoutes);
app.use(`${apiUrl}/login`, authRoutes);
app.use(`${apiUrl}/logout`, logoutRoutes);
app.use(`${apiUrl}/refreshToken`, refreshRoutes);
// app.use(`/admin`, adminRoutes);

// Error handling
app.use("*", (req, res, next) => {
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
