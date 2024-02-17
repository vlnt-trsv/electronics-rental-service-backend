const express = require("express");
const router = express.Router();
const RefreshTokenController = require("../controllers/refreshToken");

// Маршрут для обновления токена
router.post("/", RefreshTokenController.handleRefreshToken);

module.exports = router;