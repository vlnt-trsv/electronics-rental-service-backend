require("dotenv").config();

const express = require("express"),
  app = express(),
  session = require("express-session"),
  cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const mongoSessionDB = require("connect-mongodb-session")(session);

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swaggerSpec");

// Routes
const devicesRoutes = require("./api/routes/devices");
const rentalsRoutes = require("./api/routes/rentals");
const userRoutes = require("./api/routes/user");
const authRoutes = require("./api/routes/auth");
const logoutRoutes = require("./api/routes/logout");
const adminRoutes = require("./api/routes/admin");

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error: ", err.message);
  });

mongoose.Promise = global.Promise;
app.set("view engine", "ejs");
app.use(cors({ credentials: true, origin: "http://localhost:5000" }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));

// Настройка сессии
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // сохранять сессию, если нет изменений
    saveUninitialized: false, // cохранять сессию, даже если она не была изменена
    cookie: {
      // sameSite: "strict",
      httpOnly: true, // Куки доступны только по HTTP, недоступны для JavaScript
      secure: false, // Установить в true, если используется HTTPS
      maxAge: 24 * 60 * 60 * 1000, // Время жизни сессии в миллисекундах (здесь: 1 день)
    },
    store: new mongoSessionDB({
      uri: process.env.DB_URL,
      collection: "sessions",
    }),
  })
);

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
app.use(`${apiUrl}/devices`, devicesRoutes);
app.use(`${apiUrl}/rentals`, rentalsRoutes);
app.use(`${apiUrl}/user`, userRoutes);
app.use(`${apiUrl}/login`, authRoutes);
app.use(`${apiUrl}/logout`, logoutRoutes);
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
