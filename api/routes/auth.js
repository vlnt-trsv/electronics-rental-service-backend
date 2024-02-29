const AuthController = require("../controllers/auth");
const express = require("express");
const router = express.Router();

// Маршруты для аутентификации
router.post("/", AuthController.handleLogin);
router.post("/verify", AuthController.verifyCode);

module.exports = router;
