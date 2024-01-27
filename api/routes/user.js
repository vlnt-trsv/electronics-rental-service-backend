require("dotenv").config();

const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
const checkAuth = require("../middlewares/check-auth");

// Создание нового пользователя
router.post("/signup", UserController.user_singup);

// Логин пользователя
router.post("/login", UserController.user_login);

// Удаление пользователя
router.delete("/:userId", checkAuth, UserController.user_delete);

module.exports = router;
