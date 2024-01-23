require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const router = require("./router/index");

const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/api", router);

const start = async () => {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
  } catch (e) {
    console.error("Ошибка подключения к базе данных:", e.message);
    process.exit(1);
  }
};

start();
